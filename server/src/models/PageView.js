const mongoose = require("mongoose");

const pageViewSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, index: true },
    referrer: String
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

pageViewSchema.index({ createdAt: -1 });
// Retain raw view events for 180 days.
pageViewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 180 * 24 * 60 * 60 });

module.exports = mongoose.model("PageView", pageViewSchema);
