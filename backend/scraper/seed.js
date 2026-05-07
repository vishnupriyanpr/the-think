const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const Problem = require("../models/Problem");
const { scoreProblem } = require("../utils/saasScorer");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/thethink";

const seedProblems = [
  {
    title: "Freelancers manually tracking invoices in spreadsheets",
    description:
      "I spend every week manually updating a spreadsheet to track which clients have paid and which invoices are overdue. There's no simple tool that connects to my bank and auto-reconciles payments. I'd happily pay for something that automates this recurring headache.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/freelance/comments/example1",
    domain: "fintech",
    difficulty: "month",
    upvotes: 1820,
    tags: ["invoicing", "freelance", "automation", "payments"],
  },
  {
    title: "No affordable way to split recurring group expenses",
    description:
      "Every month my roommates and I argue about who paid for what. We copy-paste Venmo transactions into a Google Sheet to track expenses. Splitwise is close but it doesn't automate recurring bills like rent and utilities.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/personalfinance/comments/example2",
    domain: "fintech",
    difficulty: "weekend",
    upvotes: 2340,
    tags: ["expense-splitting", "roommates", "recurring-bills"],
  },
  {
    title: "Crypto portfolio tax reporting is a nightmare",
    description:
      "I trade across five exchanges and every year I manually export CSVs and try to calculate cost basis. The existing software is expensive and never integrates with newer DeFi protocols. I need a dashboard that auto-pulls transactions and generates tax reports.",
    source: "hackernews",
    sourceUrl: "https://news.ycombinator.com/item?id=example3",
    domain: "fintech",
    difficulty: "quarter",
    upvotes: 890,
    tags: ["crypto", "taxes", "portfolio", "automation"],
  },
  {
    title: "Students can't find study groups for niche subjects",
    description:
      "Every semester I email classmates trying to form study groups for advanced courses. There's no tool that matches students by course, availability, and learning style. Universities have thousands of students but no software to facilitate peer learning.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/college/comments/example4",
    domain: "edtech",
    difficulty: "month",
    upvotes: 1560,
    tags: ["study-groups", "peer-learning", "university"],
  },
  {
    title: "Online course completion rates are abysmal",
    description:
      "I always buy courses and never finish them. There's no dashboard that tracks my progress across Udemy, Coursera, and YouTube playlists in one place. I need accountability software with daily nudges and streak tracking to keep me on track.",
    source: "hackernews",
    sourceUrl: "https://news.ycombinator.com/item?id=example5",
    domain: "edtech",
    difficulty: "month",
    upvotes: 2100,
    tags: ["online-learning", "accountability", "progress-tracking"],
  },
  {
    title: "Teachers wasting hours on manual grading of essays",
    description:
      "I spend every weekend grading 150+ essays by hand. I copy-paste rubric comments repeatedly and track scores in a spreadsheet. I'd pay for an AI tool that auto-grades based on my rubric and integrates with my LMS.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/teachers/comments/example6",
    domain: "edtech",
    difficulty: "quarter",
    upvotes: 780,
    tags: ["grading", "education", "AI", "LMS-integration"],
  },
  {
    title: "No simple way to track supplements and their effects",
    description:
      "I take six supplements daily and have no idea which ones actually work. I manually log my energy, sleep, and mood in a spreadsheet. I want a tool that helps me track intake and correlate it with health metrics over time.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/supplements/comments/example7",
    domain: "health",
    difficulty: "month",
    upvotes: 1240,
    tags: ["supplements", "health-tracking", "correlation"],
  },
  {
    title: "Therapists struggling to track patient homework compliance",
    description:
      "As a therapist, I always assign CBT homework but patients never remember to do it. I manually email reminders and there's no software that lets me create custom exercises and track completion between sessions. This is a recurring frustration.",
    source: "hackernews",
    sourceUrl: "https://news.ycombinator.com/item?id=example8",
    domain: "health",
    difficulty: "month",
    upvotes: 640,
    tags: ["therapy", "mental-health", "patient-engagement"],
  },
  {
    title: "Chronic pain patients can't share symptom data with doctors",
    description:
      "I track my pain levels daily in a notebook and every visit I try to summarize weeks of data for my doctor. There's no tool that generates a visual dashboard from daily symptom logs that I can share with my healthcare provider via a simple link.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/chronicpain/comments/example9",
    domain: "health",
    difficulty: "month",
    upvotes: 1890,
    tags: ["chronic-pain", "symptom-tracking", "doctor-sharing", "dashboard"],
  },
  {
    title: "Managing multiple to-do apps is itself a productivity problem",
    description:
      "I use Notion for projects, Todoist for daily tasks, and Google Calendar for scheduling. Every morning I manually cross-reference three tools to plan my day. I need a single dashboard that integrates all three and gives me one unified daily view.",
    source: "hackernews",
    sourceUrl: "https://news.ycombinator.com/item?id=example10",
    domain: "productivity",
    difficulty: "quarter",
    upvotes: 3200,
    tags: ["productivity", "integration", "task-management", "dashboard"],
  },
  {
    title: "Meeting notes never get turned into action items",
    description:
      "After every meeting, someone copy-pastes notes into Slack and action items get lost. There's no tool that auto-extracts tasks from meeting transcripts and assigns them to team members. We need software that integrates with Zoom and our project tracker.",
    source: "producthunt",
    sourceUrl: "https://producthunt.com/posts/example11",
    domain: "productivity",
    difficulty: "month",
    upvotes: 1750,
    tags: ["meetings", "action-items", "automation", "teams"],
  },
  {
    title: "Remote teams can't do async standup updates efficiently",
    description:
      "Our team is across 4 timezones and daily standups at one time never work. We email updates that nobody reads. I want a simple tool where everyone posts their daily update asynchronously and a dashboard surfaces blockers automatically.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/remotework/comments/example12",
    domain: "productivity",
    difficulty: "weekend",
    upvotes: 980,
    tags: ["remote-work", "standup", "async", "team-communication"],
  },
  {
    title: "Small Shopify stores can't afford good analytics",
    description:
      "Shopify's built-in analytics are basic and every third-party tool costs $200+/month. I just want a simple dashboard showing my real profit margins after fees, shipping cost, and returns. The expensive tools track everything but what small sellers actually need.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/shopify/comments/example13",
    domain: "ecommerce",
    difficulty: "month",
    upvotes: 2680,
    tags: ["shopify", "analytics", "profit-tracking", "small-business"],
  },
  {
    title: "Product returns are killing margins and hard to track",
    description:
      "I sell on Amazon and Shopify and manually track returns in a spreadsheet. There's no affordable tool that shows return rates by product, reason codes, and the actual cost impact. I need software that integrates with both platforms.",
    source: "hackernews",
    sourceUrl: "https://news.ycombinator.com/item?id=example14",
    domain: "ecommerce",
    difficulty: "month",
    upvotes: 560,
    tags: ["returns", "ecommerce", "analytics", "multi-platform"],
  },
  {
    title: "Dropshippers can't automate supplier price monitoring",
    description:
      "Every day I manually check 50+ supplier pages for price changes that affect my margins. If a supplier raises prices, I lose money on orders already placed. I need a tool that auto-monitors supplier pricing and alerts me or auto-adjusts my store prices.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/dropshipping/comments/example15",
    domain: "ecommerce",
    difficulty: "month",
    upvotes: 1120,
    tags: ["dropshipping", "price-monitoring", "automation", "margins"],
  },
  {
    title: "No good free API monitoring for indie developers",
    description:
      "I run three side projects and every time an API goes down, I find out from angry users. The existing uptime tools are expensive for hobby projects. I need a simple, free dashboard that pings my endpoints every minute and sends me a Slack alert.",
    source: "hackernews",
    sourceUrl: "https://news.ycombinator.com/item?id=example16",
    domain: "devtools",
    difficulty: "weekend",
    upvotes: 3800,
    tags: ["api-monitoring", "uptime", "indie-dev", "alerts"],
  },
  {
    title: "Managing environment variables across projects is chaos",
    description:
      "I always forget which .env keys each project needs. I copy-paste secrets between local, staging, and production manually. There should be a tool that lets teams manage, share, and sync environment variables securely across all environments.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/webdev/comments/example17",
    domain: "devtools",
    difficulty: "month",
    upvotes: 1450,
    tags: ["env-variables", "secrets-management", "devops"],
  },
  {
    title: "Code review bottlenecks are slowing down small teams",
    description:
      "On my team, PRs sit for days because we have no automated way to assign reviewers or track review turnaround. I want a dashboard that integrates with GitHub, auto-assigns based on file ownership, and surfaces stale PRs daily.",
    source: "hackernews",
    sourceUrl: "https://news.ycombinator.com/item?id=example18",
    domain: "devtools",
    difficulty: "month",
    upvotes: 920,
    tags: ["code-review", "github", "team-productivity", "automation"],
  },
  {
    title: "Database migration tracking across microservices is painful",
    description:
      "We have 12 microservices each with their own database and I manually track which migrations have been run where. There's no centralized dashboard that shows migration status across all services. Every deploy is a manual checklist nightmare.",
    source: "hackernews",
    sourceUrl: "https://news.ycombinator.com/item?id=example19",
    domain: "devtools",
    difficulty: "quarter",
    upvotes: 410,
    tags: ["database", "migrations", "microservices", "devops"],
  },
  {
    title: "SaaS companies can't easily track feature request trends",
    description:
      "Our users submit feature requests through email, Intercom, and Twitter. We manually copy-paste them into a spreadsheet and try to spot recurring themes. I want software that aggregates requests from multiple channels and auto-groups similar ones.",
    source: "producthunt",
    sourceUrl: "https://producthunt.com/posts/example20",
    domain: "saas",
    difficulty: "month",
    upvotes: 1680,
    tags: ["feature-requests", "customer-feedback", "aggregation"],
  },
  {
    title: "Churn prediction for small SaaS is nonexistent",
    description:
      "Enterprise tools like Gainsight cost a fortune. I run a SaaS with 500 users and I track usage manually in a spreadsheet to guess who might churn. I need an affordable tool that integrates with Stripe and my app's API to auto-flag at-risk users.",
    source: "hackernews",
    sourceUrl: "https://news.ycombinator.com/item?id=example21",
    domain: "saas",
    difficulty: "quarter",
    upvotes: 720,
    tags: ["churn", "saas-analytics", "retention", "stripe"],
  },
  {
    title: "No simple tool to create and manage SaaS changelogs",
    description:
      "Every week I manually write changelog entries in Notion and then copy-paste them to our website. I want a tool where I can write updates, tag them by type, and it auto-publishes a beautiful changelog page. Bonus if it integrates with GitHub releases.",
    source: "producthunt",
    sourceUrl: "https://producthunt.com/posts/example22",
    domain: "saas",
    difficulty: "weekend",
    upvotes: 1340,
    tags: ["changelog", "product-updates", "developer-tools"],
  },
  {
    title: "Onboarding checklists for SaaS are always half-baked",
    description:
      "I've tried building onboarding flows in-house three times and they always break. I need a tool that lets me define a checklist of steps, track user progress, and trigger email nudges — all without writing custom code every time.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/saas/comments/example23",
    domain: "saas",
    difficulty: "month",
    upvotes: 890,
    tags: ["onboarding", "user-activation", "checklists", "email"],
  },
  {
    title: "Nonprofit volunteer scheduling is a manual mess",
    description:
      "I run a food bank and every week I email 80 volunteers to find out who's available. Scheduling is done in a shared Google Sheet that always has conflicts. I need affordable software to automate volunteer scheduling and send recurring shift reminders.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/nonprofit/comments/example24",
    domain: "other",
    difficulty: "month",
    upvotes: 1560,
    tags: ["nonprofits", "volunteer-management", "scheduling"],
  },
  {
    title: "Local event discovery is dominated by big platforms",
    description:
      "Eventbrite and Meetup charge fees and bury small community events. I want a free tool where local organizers can post events and neighbors can discover them. Every week I see flyers but there's no single digital dashboard for my neighborhood.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/community/comments/example25",
    domain: "other",
    difficulty: "month",
    upvotes: 2200,
    tags: ["local-events", "community", "discovery", "free"],
  },
  {
    title: "Pet owners can't find reliable sitters without expensive apps",
    description:
      "Rover takes a huge fee from both sitters and owners. I always ask on Facebook groups manually to find someone trusted. There should be a simple tool for neighborhoods to share trusted pet sitters with reviews, without the expensive middleman fee.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/pets/comments/example26",
    domain: "other",
    difficulty: "month",
    upvotes: 1780,
    tags: ["pet-care", "community", "peer-to-peer"],
  },
  {
    title: "Email newsletter analytics are scattered across platforms",
    description:
      "I send newsletters via Substack and Mailchimp for different audiences and there's no unified dashboard. I manually copy-paste open rates into a spreadsheet weekly. I want one tool that integrates with both and shows all my email metrics in one place.",
    source: "producthunt",
    sourceUrl: "https://producthunt.com/posts/example27",
    domain: "saas",
    difficulty: "month",
    upvotes: 650,
    tags: ["newsletter", "email-analytics", "integration", "dashboard"],
  },
  {
    title: "Gym owners have no affordable member management software",
    description:
      "I run a small gym and pay $300/month for Mindbody which is overkill. I just need to track memberships, automate billing reminders, and manage class schedules. The cost of existing software is eating into my margins.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/gymowner/comments/example28",
    domain: "health",
    difficulty: "quarter",
    upvotes: 540,
    tags: ["gym-management", "memberships", "billing", "scheduling"],
  },
  {
    title: "Students can't track job application status across platforms",
    description:
      "I apply on LinkedIn, Indeed, and company sites and manually track everything in a spreadsheet. Every week I lose track of which companies I've heard back from. I need a tool that auto-tracks applications and sends me daily reminders to follow up.",
    source: "reddit",
    sourceUrl: "https://reddit.com/r/cscareerquestions/comments/example29",
    domain: "edtech",
    difficulty: "weekend",
    upvotes: 3400,
    tags: ["job-search", "application-tracking", "students", "automation"],
  },
  {
    title: "Freelance designers can't showcase work without expensive portfolio sites",
    description:
      "Squarespace and Wix cost money and take forever to set up. I just want to paste a Figma link or upload images and get a clean portfolio URL. Every designer I know maintains a manual portfolio that's always outdated because updating it is a hassle.",
    source: "producthunt",
    sourceUrl: "https://producthunt.com/posts/example30",
    domain: "other",
    difficulty: "weekend",
    upvotes: 1950,
    tags: ["portfolio", "designers", "showcase", "simple"],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected for seeding");

    // Clear existing data
    await Problem.deleteMany({});
    console.log("Cleared existing problems");

    // Score each problem and set viability
    const scoredProblems = seedProblems.map((p) => {
      const saasScore = scoreProblem(p);
      return {
        ...p,
        saasScore,
        isSaasViable: saasScore >= 60,
      };
    });

    // Insert all problems
    await Problem.insertMany(scoredProblems);
    console.log(`Successfully seeded ${scoredProblems.length} problems`);

    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
