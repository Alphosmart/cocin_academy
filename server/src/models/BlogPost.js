const mongoose = require("mongoose");
const makeSlug = require("../utils/slug");

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    featuredImage: String,
    category: { type: String, default: "News" },
    tags: [String],
    author: { type: String, default: "School Admin" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    seoTitle: String,
    seoDescription: String
  },
  { timestamps: true }
);

blogPostSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.title) this.slug = makeSlug(this.title);
  next();
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
