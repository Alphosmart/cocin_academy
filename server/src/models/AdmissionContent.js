const mongoose = require("mongoose");

const admissionContentSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Admissions" },
    content: String,
    requirements: [String],
    processSteps: [{ title: String, description: String }],
    ctaText: String,
    applicationFeeEnabled: { type: Boolean, default: false },
    applicationFeeAmount: { type: Number, default: 0 },
    applicationFeeCurrency: { type: String, default: "NGN" },
    paymentProvider: { type: String, default: "paystack" },
    seoTitle: String,
    seoDescription: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdmissionContent", admissionContentSchema);
