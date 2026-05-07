const express = require("express");
const router = express.Router();
const {
  getProblems,
  getStats,
  getDomains,
  getProblemById,
} = require("../controllers/problemController");

// Static routes must come before parameterized routes
router.get("/stats", getStats);
router.get("/domains/list", getDomains);

// Dynamic routes
router.get("/", getProblems);
router.get("/:id", getProblemById);

module.exports = router;
