const mongoose = require("mongoose");

const pageContentSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true },
    excerpt: String,
    content: String,
    mission: String,
    vision: String,
    coreValues: [String],
    seoTitle: String,
    seoDescription: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("PageContent", pageContentSchema);
