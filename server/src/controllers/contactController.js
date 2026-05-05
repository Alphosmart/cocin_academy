const { z } = require("zod");
const ContactMessage = require("../models/ContactMessage");
const asyncHandler = require("../middleware/asyncHandler");

const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().max(40).optional().default(""),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(5).max(3000)
});

exports.createMessage = asyncHandler(async (req, res) => {
  const data = contactSchema.parse(req.body);
  const message = await ContactMessage.create(data);
  res.status(201).json({ message: "Message sent successfully", id: message._id });
});

exports.listMessages = asyncHandler(async (req, res) => {
  res.json(await ContactMessage.find().sort("-createdAt"));
});

exports.markRead = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!message) return res.status(404).json({ message: "Message not found" });
  res.json(message);
});

exports.deleteMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) return res.status(404).json({ message: "Message not found" });
  res.json({ message: "Deleted successfully" });
});
