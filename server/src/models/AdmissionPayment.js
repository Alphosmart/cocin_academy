const mongoose = require("mongoose");

const admissionPaymentSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true, index: true },
    provider: { type: String, default: "paystack" },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending", index: true },
    amount: { type: Number, required: true },
    amountSubunit: { type: Number, required: true },
    currency: { type: String, default: "NGN" },
    payerName: { type: String, required: true },
    payerEmail: { type: String, required: true },
    payerPhone: String,
    authorizationUrl: String,
    accessCode: String,
    providerResponse: mongoose.Schema.Types.Mixed,
    paidAt: Date,
    usedAt: Date,
    application: { type: mongoose.Schema.Types.ObjectId, ref: "AdmissionApplication" }
  },
  { timestamps: true }
);

admissionPaymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model("AdmissionPayment", admissionPaymentSchema);
