const mongoose = require("mongoose");

const admissionApplicationSchema = new mongoose.Schema(
  {
    applicationNumber: { type: String, required: true, index: true },
    applicantName: { type: String, required: true },
    applicantEmail: String,
    applicantPhone: String,
    classApplyingFor: String,
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "AdmissionPayment" },
    paymentReference: String,
    feePaid: { type: Number, default: 0 },
    feeCurrency: { type: String, default: "NGN" },
    formData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

admissionApplicationSchema.index({ createdAt: -1 });
admissionApplicationSchema.index({ applicantName: "text", applicationNumber: "text", applicantEmail: "text", classApplyingFor: "text" });

module.exports = mongoose.model("AdmissionApplication", admissionApplicationSchema);
