const nodemailer = require("nodemailer");

const brevoConfigured = Boolean(process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL);
const smtpConfigured = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
const configured = brevoConfigured || smtpConfigured;

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
    console.info(`[email:disabled] To: ${to} | ${subject}`);
    return { delivered: false };
  }

  if (brevoConfigured) {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
        accept: "application/json"
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          ...(process.env.BREVO_SENDER_NAME ? { name: process.env.BREVO_SENDER_NAME } : {})
        },
        to: [{ email: to }],
        subject,
        ...(text ? { textContent: text } : {}),
        ...(html ? { htmlContent: html } : {})
      })
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Brevo email request failed (${response.status}): ${details}`);
    }
    return { delivered: true, provider: "brevo" };
  }

  const from = process.env.SMTP_FROM || `School CMS <${process.env.SMTP_USER}>`;
  await transporter.sendMail({ from, to, subject, text, html });
  return { delivered: true, provider: "smtp" };
}

module.exports = { sendEmail, emailConfigured: configured };
