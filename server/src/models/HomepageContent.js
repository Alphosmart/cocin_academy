const mongoose = require("mongoose");

const homepageContentSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: "COCIN Academy" },
    heroSubtitle: { type: String, default: "A Biblically-based learning community preparing the hearts, minds, and spirits of learners in the image of Jesus Christ." },
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
