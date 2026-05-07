const Problem = require("../models/Problem");

// Allowed values for validation
const ALLOWED_SORT_BY = ["saasScore", "upvotes", "createdAt"];
const ALLOWED_DIFFICULTIES = ["weekend", "month", "quarter"];

// GET /api/problems
async function getProblems(req, res) {
  try {
    const { domain, difficulty, isSaasViable, search, sortBy, page, limit } =
      req.query;

    const filter = {};

    // Validate and apply domain filter
    if (domain) {
      filter.domain = domain;
    }

    // Validate and apply difficulty filter
    if (difficulty) {
      if (!ALLOWED_DIFFICULTIES.includes(difficulty)) {
        return res.status(400).json({ message: "Invalid difficulty value" });
      }
      filter.difficulty = difficulty;
    }

    if (isSaasViable !== undefined) {
      filter.isSaasViable = isSaasViable === "true";
    }

    if (search) {
      // Sanitize search: trim and limit length to prevent abuse
      const sanitizedSearch = String(search).trim().slice(0, 200);
      if (sanitizedSearch) {
        filter.$text = { $search: sanitizedSearch };
      }
    }

    // Validate sort order
    const validSortBy = ALLOWED_SORT_BY.includes(sortBy)
      ? sortBy
      : "saasScore";
    const sort = { [validSortBy]: -1 };

    // Validate and clamp pagination values
    let pageNum = parseInt(page, 10);
    let limitNum = parseInt(limit, 10);

    pageNum = Number.isFinite(pageNum) && pageNum > 0 ? pageNum : 1;
    limitNum =
      Number.isFinite(limitNum) && limitNum > 0
        ? Math.min(limitNum, 50) // cap at 50 to prevent abuse
        : 12;

    const skip = (pageNum - 1) * limitNum;

    const [problems, total] = await Promise.all([
      Problem.find(filter).sort(sort).skip(skip).limit(limitNum),
      Problem.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      problems,
      total,
      page: pageNum,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ message: "Server error fetching problems" });
  }
}

// GET /api/problems/stats
async function getStats(req, res) {
  try {
    const total = await Problem.countDocuments();
    const saasViableCount = await Problem.countDocuments({
      isSaasViable: true,
    });

    const avgResult = await Problem.aggregate([
      { $group: { _id: null, avgScore: { $avg: "$saasScore" } } },
    ]);
    const avgSaasScore =
      avgResult.length > 0 ? Math.round(avgResult[0].avgScore) : 0;

    const topDomainResult = await Problem.aggregate([
      { $group: { _id: "$domain", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    const topDomain =
      topDomainResult.length > 0 ? topDomainResult[0]._id : "N/A";

    res.json({
      total,
      saasViableCount,
      avgSaasScore,
      topDomain,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Server error fetching stats" });
  }
}

// GET /api/problems/domains/list
async function getDomains(req, res) {
  try {
    const domains = await Problem.distinct("domain");
    res.json(domains.filter(Boolean).sort((a, b) => a.localeCompare(b)));
  } catch (error) {
    console.error("Error fetching domains:", error);
    res.status(500).json({ message: "Server error fetching domains" });
  }
}

// GET /api/problems/:id
async function getProblemById(req, res) {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json(problem);
  } catch (error) {
    console.error("Error fetching problem:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(500).json({ message: "Server error fetching problem" });
  }
}

module.exports = {
  getProblems,
  getStats,
  getDomains,
  getProblemById,
};
