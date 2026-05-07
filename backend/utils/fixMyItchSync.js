const crypto = require("crypto");
const https = require("https");
const Problem = require("../models/Problem");

const FIX_MY_ITCH_URL = "https://razorpay.com/m/fix-my-itch/";
const FRAMER_SITE_BASE =
  "https://framerusercontent.com/sites/6gNMFZ8tUMj34P468SM7Gi/";
const SYNC_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const REQUEST_TIMEOUT_MS = 25000;

// Actual categories used on Fix My Itch
const KNOWN_INDUSTRIES = new Set([
  "B2B Services",
  "Beauty & Personal Care",
  "Consumer Services",
  "E-commerce",
  "EdTech",
  "FinTech",
  "Food & Beverage",
  "Home Services",
  "Logistics",
  "Payment Issues",
  "Real Estate",
  "SaaS",
  "Transportation",
  "Travel",
  "Healthtech",
  "Healthcare",
  "Automotive",
  "Housing",
  "Career",
  "Hardware",
  "Other",
]);

// Map raw industry names → our domain slugs
const INDUSTRY_TO_DOMAIN = {
  "B2B Services": "b2b-services",
  "Beauty & Personal Care": "beauty-personal-care",
  "Consumer Services": "consumer-services",
  "E-commerce": "ecommerce",
  EdTech: "edtech",
  FinTech: "fintech",
  "Food & Beverage": "food-beverage",
  "Home Services": "home-services",
  Logistics: "logistics",
  "Payment Issues": "fintech",
  "Real Estate": "real-estate",
  SaaS: "saas",
  Transportation: "transportation",
  Travel: "travel",
  Healthtech: "health",
  Healthcare: "health",
  Automotive: "automotive",
  Housing: "real-estate",
  Career: "career",
  Hardware: "devtools",
  Other: "other",
};

// ── Helpers ────────────────────────────────────────────────

function toExternalId(title, domain) {
  return crypto
    .createHash("sha1")
    .update(`${domain}::${title.toLowerCase().trim()}`)
    .digest("hex");
}

function normalizeDifficulty(score) {
  if (score >= 80) return "month";
  if (score >= 60) return "weekend";
  return "quarter";
}

function normalizeScore(value) {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? Math.max(0, Math.min(Math.round(n), 100)) : null;
}

function industryToDomain(raw) {
  return INDUSTRY_TO_DOMAIN[raw] || "other";
}

function buildRecord(title, score, rawIndustry) {
  const domain = industryToDomain(rawIndustry);
  const externalId = toExternalId(title, domain);
  const industryTag = rawIndustry
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return {
    title,
    description: `${title} Source: Razorpay Fix My Itch. Industry: ${rawIndustry}.`,
    source: "fixmyitch",
    sourceUrl: FIX_MY_ITCH_URL,
    domain,
    difficulty: normalizeDifficulty(score),
    saasScore: score,
    tags: ["fix-my-itch", industryTag],
    upvotes: score,
    isSaasViable: score >= 60,
    externalId,
    syncedAt: new Date(),
  };
}

// ── HTTP fetch ─────────────────────────────────────────────

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        timeout: REQUEST_TIMEOUT_MS,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/json,*/*;q=0.8",
          Referer: "https://razorpay.com/m/fix-my-itch/",
        },
      },
      (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          res.resume();
          fetchText(new URL(res.headers.location, url).toString())
            .then(resolve)
            .catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve(body));
      }
    );
    req.on("timeout", () =>
      req.destroy(new Error("Request timed out"))
    );
    req.on("error", reject);
  });
}

// ── Parsers ────────────────────────────────────────────────

/** Parse the Framer searchIndex JSON — extracts problems from the
 *  /m/fix-my-itch/ entry's `p` (paragraph) array.
 *  Pattern: title (Why ...?) → score (number) → industry (known string) */
function parseSearchIndex(json) {
  let data;
  try {
    data = JSON.parse(json);
  } catch {
    return [];
  }

  const entry = data["/m/fix-my-itch/"];
  if (!entry || !Array.isArray(entry.p)) return [];

  const paragraphs = entry.p;
  const records = [];
  const seen = new Set();

  for (let i = 0; i < paragraphs.length; i++) {
    const line = paragraphs[i];

    // Must be a "Why …?" problem title
    if (!/^why\s/i.test(line) || !line.endsWith("?") || line.length < 18) {
      continue;
    }

    // Next paragraph might be a score
    const nextVal = paragraphs[i + 1] || "";
    const score = normalizeScore(nextVal);
    if (score === null) continue; // skip entries without a score

    // The one after may be an industry name
    const industryVal = paragraphs[i + 2] || "";
    const rawIndustry = KNOWN_INDUSTRIES.has(industryVal)
      ? industryVal
      : "Other";

    const rec = buildRecord(line, score, rawIndustry);
    if (!seen.has(rec.externalId)) {
      seen.add(rec.externalId);
      records.push(rec);
    }
  }

  return records;
}

/** Parse the raw HTML page — same Title → Score → Industry pattern
 *  but from stripped HTML lines instead of the paragraph array. */
function parseHtml(html) {
  const lines = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, "\n")
    .split("\n")
    .map((l) =>
      l
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&rsquo;|&lsquo;|&#x27;/g, "'")
        .replace(/&rdquo;|&ldquo;/g, '"')
        .replace(/&ndash;|&mdash;/g, "-")
        .replace(/&nbsp;/g, " ")
        .replace(/&#x2F;/g, "/")
        .replace(/\s+/g, " ")
        .trim()
    )
    .filter(Boolean);

  const records = [];
  const seen = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!/^why\s/i.test(line) || !line.endsWith("?") || line.length < 18)
      continue;

    const nextVal = lines[i + 1] || "";
    const score = normalizeScore(nextVal);
    if (score === null) continue;

    const industryVal = lines[i + 2] || "";
    const rawIndustry = KNOWN_INDUSTRIES.has(industryVal)
      ? industryVal
      : "Other";

    const rec = buildRecord(line, score, rawIndustry);
    if (!seen.has(rec.externalId)) {
      seen.add(rec.externalId);
      records.push(rec);
    }
  }

  return records;
}

// ── Sync logic ─────────────────────────────────────────────

async function syncFixMyItchProblems() {
  // Step 1 — fetch the page HTML
  const html = await fetchText(FIX_MY_ITCH_URL);

  // Step 2 — discover searchIndex URLs from the HTML
  const indexMatches =
    html.match(
      /https:\/\/framerusercontent\.com\/sites\/[^"'\s)]+searchIndex[^"'\s)]+\.json/g
    ) || [];

  // Step 3 — parse HTML directly
  let allRecords = parseHtml(html);
  const seenIds = new Set(allRecords.map((r) => r.externalId));

  // Step 4 — also fetch + parse every searchIndex JSON (dedup against HTML records)
  for (const url of [...new Set(indexMatches)]) {
    try {
      const json = await fetchText(url);
      const extra = parseSearchIndex(json);
      for (const rec of extra) {
        if (!seenIds.has(rec.externalId)) {
          seenIds.add(rec.externalId);
          allRecords.push(rec);
        }
      }
    } catch (err) {
      console.warn(`SearchIndex fetch failed (${url}):`, err.message);
    }
  }

  if (allRecords.length === 0) {
    console.warn(
      "Fix My Itch sync: 0 records parsed — page structure may have changed"
    );
    return { fetched: 0, result: null };
  }

  // Step 5 — upsert into MongoDB
  const ops = allRecords.map((r) => ({
    updateOne: {
      filter: { source: "fixmyitch", externalId: r.externalId },
      update: { $set: r, $setOnInsert: { createdAt: new Date() } },
      upsert: true,
    },
  }));

  const result = await Problem.bulkWrite(ops, { ordered: false });
  console.log(
    `Fix My Itch sync: ${allRecords.length} parsed, ` +
      `${result.upsertedCount} new, ${result.modifiedCount} updated`
  );

  return { fetched: allRecords.length, result };
}

function startFixMyItchSync() {
  const run = () =>
    syncFixMyItchProblems().catch((err) =>
      console.error("Fix My Itch sync failed:", err.message)
    );

  run();
  return setInterval(run, SYNC_INTERVAL_MS);
}

// ── Exports ────────────────────────────────────────────────

module.exports = {
  startFixMyItchSync,
  syncFixMyItchProblems,
  parseSearchIndex,
  parseHtml,
};
