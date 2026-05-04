const { z } = require("zod");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const signToken = require("../utils/token");

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  res.json({
    token: signToken(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
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
