const { z } = require("zod");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const asyncHandler = require("../middleware/asyncHandler");
const signToken = require("../utils/token");
const { clearAuthCookie, setAuthCookie } = require("../utils/authCookie");

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  token: z.string().trim().optional() // TOTP code when 2FA is enabled
});

function recordAuth(req, user, action) {
  AuditLog.create({
    user: user._id,
    userName: user.name,
    userEmail: user.email,
    action,
    resource: "auth",
    method: req.method,
    path: req.originalUrl,
    status: 200,
    ip: req.ip
  }).catch((error) => console.error("Audit log failed:", error.message));
}

exports.login = asyncHandler(async (req, res) => {
  const { email, password, token } = loginSchema.parse(req.body);
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password +twoFactorSecret");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  if (user.twoFactorEnabled) {
    if (!token) return res.status(206).json({ twoFactorRequired: true, message: "Two-factor code required" });
    const valid = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: "base32", token: String(token), window: 1 });
    if (!valid) return res.status(401).json({ message: "Invalid two-factor code" });
  }
  const authToken = signToken(user);
  setAuthCookie(res, authToken);
  recordAuth(req, user, "login");
  res.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role, twoFactorEnabled: user.twoFactorEnabled, isDeveloper: user.isDeveloper }
  });
});

exports.logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  if (req.user) recordAuth(req, req.user, "logout");
  res.json({ message: "Logged out successfully" });
});

exports.me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const schema = z.object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8)
  });
  const { currentPassword, newPassword } = schema.parse(req.body);
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.matchPassword(currentPassword))) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }
  user.password = newPassword;
  await user.save();
  res.json({ message: "Password changed successfully" });
});

// --- Two-factor authentication ---------------------------------------------

// Step 1: generate a secret and QR code for the authenticator app.
exports.setupTwoFactor = asyncHandler(async (req, res) => {
  const secret = speakeasy.generateSecret({ name: `School CMS (${req.user.email})` });
  await User.findByIdAndUpdate(req.user._id, { twoFactorSecret: secret.base32, twoFactorEnabled: false });
  const qr = await qrcode.toDataURL(secret.otpauth_url);
  res.json({ secret: secret.base32, qr });
});

// Step 2: verify a code from the app to activate 2FA.
exports.enableTwoFactor = asyncHandler(async (req, res) => {
  const { token } = z.object({ token: z.string().trim().min(6) }).parse(req.body);
  const user = await User.findById(req.user._id).select("+twoFactorSecret");
  if (!user.twoFactorSecret) return res.status(400).json({ message: "Start 2FA setup first" });
  const valid = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: "base32", token: String(token), window: 1 });
  if (!valid) return res.status(400).json({ message: "Invalid code. Try again." });
  user.twoFactorEnabled = true;
  await user.save();
  res.json({ message: "Two-factor authentication enabled" });
});

exports.disableTwoFactor = asyncHandler(async (req, res) => {
  const { password } = z.object({ password: z.string().min(8) }).parse(req.body);
  const user = await User.findById(req.user._id).select("+password");
  if (!(await user.matchPassword(password))) {
    return res.status(400).json({ message: "Password is incorrect" });
  }
  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  await user.save();
  res.json({ message: "Two-factor authentication disabled" });
});
