const nodemailer = require("nodemailer");

const configured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

let transporter = null;
if (configured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

// Send an email. Degrades gracefully when SMTP isn't configured (logs to the
// console in development) so flows like password reset still work locally.
async function sendEmail({ to, subject, text, html }) {
  if (!configured) {
    console.info(`[email:disabled] To: ${to} | ${subject}\n${text || ""}`);
    return { delivered: false };
  }
  const from = process.env.SMTP_FROM || `School CMS <${process.env.SMTP_USER}>`;
  await transporter.sendMail({ from, to, subject, text, html });
  return { delivered: true };
}

module.exports = { sendEmail, emailConfigured: configured };
