const mongoose = require("mongoose");

const homepageContentSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: "Welcome to Bright Future Academy" },
    heroSubtitle: { type: String, default: "A caring school where every child is known, challenged, and inspired." },
    heroImage: String,
    heroSlides: [
      {
        title: String,
        subtitle: String,
        image: String,
        ctaLabel: String,
        ctaLink: String
      }
    ],
    aboutPreview: String,
    whyChooseUs: [{ title: String, description: String }],
    admissionsCtaTitle: { type: String, default: "Begin your admissions journey" },
    admissionsCtaText: String,
    seoTitle: String,
    seoDescription: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomepageContent", homepageContentSchema);
