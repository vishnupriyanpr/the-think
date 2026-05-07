/**
 * Scores a problem for SaaS viability on a 0–100 scale.
 * Additive scoring based on keyword signals, difficulty, and demand.
 *
 * @param {Object} problem - Problem object with description, difficulty, upvotes
 * @returns {number} Score between 0 and 100
 */
function scoreProblem(problem) {
  let score = 0;
  const desc = (problem.description || "").toLowerCase();

  // +20 — Recurring need signals
  const recurringWords = ["every", "always", "daily", "weekly", "recurring"];
  if (recurringWords.some((word) => desc.includes(word))) {
    score += 20;
  }

  // +20 — Manual process signals
  const manualWords = ["manual", "spreadsheet", "email", "copy-paste", "track"];
  if (manualWords.some((word) => desc.includes(word))) {
    score += 20;
  }

  // +15 — Willingness to pay signals
  const payWords = ["pay", "money", "cost", "expensive", "fee"];
  if (payWords.some((word) => desc.includes(word))) {
    score += 15;
  }

  // +15 — Buildable by one dev
  if (problem.difficulty === "weekend" || problem.difficulty === "month") {
    score += 15;
  }

  // +15 — Validated demand
  if (problem.upvotes > 500) {
    score += 15;
  }

  // +15 — SaaS-native signals
  const saasWords = [
    "api",
    "integrate",
    "automate",
    "software",
    "tool",
    "dashboard",
  ];
  if (saasWords.some((word) => desc.includes(word))) {
    score += 15;
  }

  return Math.min(score, 100);
}

module.exports = { scoreProblem };
