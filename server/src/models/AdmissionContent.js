const mongoose = require("mongoose");

const admissionContentSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Admissions" },
    content: String,
    requirements: [String],
    processSteps: [{ title: String, description: String }],
    ctaText: String,
    seoTitle: String,
    seoDescription: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdmissionContent", admissionContentSchema);
