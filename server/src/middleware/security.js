const rateLimit = require("express-rate-limit");

function configuredOrigins() {
  return (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function isTrustedDevOrigin(origin) {
  return process.env.NODE_ENV !== "production" && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
}

function originFromRequest(req) {
  const origin = req.get("origin");
  if (origin) return origin;
  const referer = req.get("referer");
  if (!referer) return "";
  try {
    return new URL(referer).origin;
  } catch (error) {
    return "";
  }
}

function requireTrustedOrigin(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const origin = originFromRequest(req);
  if (origin && (configuredOrigins().includes(origin) || isTrustedDevOrigin(origin))) return next();
  if (!origin && process.env.NODE_ENV !== "production") return next();
  return res.status(403).json({ message: "Request origin is not allowed" });
}

function noStore(req, res, next) {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
}

const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === "production" ? 120 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many admin requests. Please wait a few minutes and try again." }
});

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === "production" ? 5 : 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please wait 15 minutes and try again." },
  skipSuccessfulRequests: true
});

module.exports = { adminRateLimit, loginRateLimit, noStore, requireTrustedOrigin };
