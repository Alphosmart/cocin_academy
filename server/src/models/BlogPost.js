const mongoose = require("mongoose");
const makeUniqueSlug = require("../utils/uniqueSlug");

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

blogPostSchema.pre("validate", async function setSlug() {
  if (!this.slug && this.title) this.slug = await makeUniqueSlug(this.constructor, this.title, this._id);
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
