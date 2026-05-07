const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
    enum: ["reddit", "hackernews", "producthunt", "fixmyitch"],
  },
  sourceUrl: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
    enum: ["weekend", "month", "quarter"],
  },
  saasScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  tags: {
    type: [String],
    default: [],
  },
  upvotes: {
    type: Number,
    required: true,
    default: 0,
  },
  isSaasViable: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  externalId: {
    type: String,
    index: true,
  },
  syncedAt: {
    type: Date,
  },
});

problemSchema.index({ title: "text", description: "text" });
problemSchema.index({ domain: 1, saasScore: -1 });
problemSchema.index({ isSaasViable: 1, saasScore: -1 });
problemSchema.index({ source: 1, externalId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model("Problem", problemSchema);
