const { z } = require("zod");
const ContactMessage = require("../models/ContactMessage");
const asyncHandler = require("../middleware/asyncHandler");
const { sendEmail } = require("../utils/email");

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

  // Notify the admin inbox (best-effort — never block the visitor's response).
  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL || process.env.SMTP_USER;
  if (notifyTo) {
    sendEmail({
      to: notifyTo,
      subject: `New contact message: ${data.subject}`,
      text: `From: ${data.fullName} <${data.email}>${data.phone ? ` (${data.phone})` : ""}\n\n${data.message}`,
      html: `<p><strong>From:</strong> ${data.fullName} &lt;${data.email}&gt;${data.phone ? ` (${data.phone})` : ""}</p><p><strong>Subject:</strong> ${data.subject}</p><p>${data.message.replace(/\n/g, "<br>")}</p>`
    }).catch((error) => console.error("Contact notification failed:", error.message));
  }

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
