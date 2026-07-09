const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const ctrl = require("../controllers/admissionPaymentController");

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === "production" ? 10 : 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many payment attempts. Please wait a few minutes and try again." }
});

router.post("/initialize", paymentLimiter, ctrl.initializePayment);
router.get("/verify/:reference", ctrl.verifyPayment);

module.exports = router;
