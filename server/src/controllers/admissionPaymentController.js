const { z } = require("zod");
const AdmissionContent = require("../models/AdmissionContent");
const AdmissionPayment = require("../models/AdmissionPayment");
const asyncHandler = require("../middleware/asyncHandler");

const PAYSTACK_BASE_URL = "https://api.paystack.co";
const REFERENCE_PATTERN = /^[A-Za-z0-9._=-]+$/;

const initializeSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().max(40).optional().default("")
});

async function admissionSettings() {
  let settings = await AdmissionContent.findOne();
  if (!settings) settings = await AdmissionContent.create({});
  return settings;
}

function paymentRequired(settings) {
  return Boolean(settings.applicationFeeEnabled && Number(settings.applicationFeeAmount) > 0);
}

function amountSubunit(amount) {
  return Math.round(Number(amount || 0) * 100);
}

function clientOrigin(req) {
  const origin = req.get("origin");
  if (origin) return origin;
  return (process.env.CLIENT_URL || "http://localhost:5173").split(",")[0].trim();
}

function makeReference() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 10).toUpperCase();
  return `ADM-FEE-${date}-${suffix}`;
}

function requirePaystackSecret() {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    const error = new Error("Paystack is not configured. Please set PAYSTACK_SECRET_KEY on the server.");
    error.statusCode = 500;
    throw error;
  }
  return secret;
}

async function paystackRequest(path, options = {}) {
  const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${requirePaystackSecret()}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.status === false) {
    const error = new Error(data.message || "Paystack request failed");
    error.statusCode = response.status || 502;
    throw error;
  }
  return data;
}

exports.initializePayment = asyncHandler(async (req, res) => {
  const payer = initializeSchema.parse(req.body);
  const settings = await admissionSettings();
  if (!paymentRequired(settings)) return res.status(400).json({ message: "Admission payment is not required right now." });
  if (settings.paymentProvider && settings.paymentProvider !== "paystack") return res.status(400).json({ message: "Selected payment provider is not supported yet." });

  const amount = Number(settings.applicationFeeAmount);
  const currency = settings.applicationFeeCurrency || "NGN";
  const reference = makeReference();
  const callbackUrl = `${clientOrigin(req).replace(/\/$/, "")}/admissions`;

  const payment = await AdmissionPayment.create({
    reference,
    amount,
    amountSubunit: amountSubunit(amount),
    currency,
    payerName: payer.fullName,
    payerEmail: payer.email,
    payerPhone: payer.phone,
    provider: "paystack"
  });

  try {
    const initialized = await paystackRequest("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify({
        email: payer.email,
        amount: String(payment.amountSubunit),
        currency,
        reference,
        callback_url: callbackUrl,
        metadata: JSON.stringify({
          purpose: "admission_application_fee",
          payerName: payer.fullName,
          payerPhone: payer.phone
        })
      })
    });

    if (!initialized.data?.authorization_url) {
      const error = new Error("Paystack did not return a payment link.");
      error.statusCode = 502;
      throw error;
    }

    payment.authorizationUrl = initialized.data?.authorization_url;
    payment.accessCode = initialized.data?.access_code;
    payment.providerResponse = initialized.data;
    await payment.save();

    res.status(201).json({
      reference: payment.reference,
      authorizationUrl: payment.authorizationUrl,
      amount: payment.amount,
      currency: payment.currency
    });
  } catch (error) {
    payment.status = "failed";
    payment.providerResponse = { message: error.message };
    await payment.save();
    throw error;
  }
});

exports.verifyPayment = asyncHandler(async (req, res) => {
  const reference = String(req.params.reference || "").trim();
  if (!REFERENCE_PATTERN.test(reference)) return res.status(400).json({ message: "Invalid payment reference" });

  const payment = await AdmissionPayment.findOne({ reference });
  if (!payment) return res.status(404).json({ message: "Payment reference not found" });

  if (payment.status === "paid") {
    return res.json({
      paid: true,
      reference: payment.reference,
      amount: payment.amount,
      currency: payment.currency,
      used: Boolean(payment.usedAt)
    });
  }

  const verified = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`, { method: "GET" });
  const data = verified.data || {};
  const paid = data.status === "success" && Number(data.amount) >= payment.amountSubunit && data.currency === payment.currency;

  payment.providerResponse = data;
  payment.status = paid ? "paid" : "failed";
  payment.paidAt = paid ? new Date(data.paid_at || data.paidAt || Date.now()) : payment.paidAt;
  await payment.save();

  res.json({
    paid,
    reference: payment.reference,
    amount: payment.amount,
    currency: payment.currency,
    used: Boolean(payment.usedAt),
    message: paid ? "Payment verified" : "Payment was not successful"
  });
});
