const { z } = require("zod");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

exports.listUsers = asyncHandler(async (req, res) => {
  res.json(await User.find().select("-password").sort("name"));
});

exports.createUser = asyncHandler(async (req, res) => {
  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8)
  });
  const data = schema.parse(req.body);
  const user = await User.create(data);
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, email: req.body.email, isActive: req.body.isActive },
    { new: true, runValidators: true }
  ).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

exports.deleteUser = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.id) return res.status(400).json({ message: "You cannot delete your own account" });
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "Deleted successfully" });
});
