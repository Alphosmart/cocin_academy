function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function passwordEmail({ name, link, firstLogin = false }) {
  const safeName = escapeHtml(name || "there");
  const safeLink = escapeHtml(link);
  const subject = firstLogin ? "Set up your COCIN Academy account" : "Reset your COCIN Academy password";
  const action = firstLogin ? "Choose a password" : "Reset password";
  const explanation = firstLogin
    ? "Your COCIN Academy admin account is ready. Set a password to activate your access."
    : "We received a request to reset the password for your COCIN Academy admin account.";
  const text = `${subject}\n\nHello ${name || "there"},\n\n${explanation}\n\n${action}: ${link}\n\nThis one-time link expires in one hour. If you did not request this, you can ignore this email.`;
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f2f4f7;color:#202334;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(explanation)}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f2f4f7;">
      <tr>
        <td align="center" style="padding:36px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:560px;background-color:#ffffff;border:1px solid #e3e6eb;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:24px 32px;background-color:#302f62;border-bottom:4px solid #e72125;">
                <p style="margin:0;color:#ffffff;font-size:17px;font-weight:700;letter-spacing:1px;">COCIN ACADEMY</p>
                <p style="margin:6px 0 0;color:#d9d9e8;font-size:12px;">ADMIN ACCOUNT SECURITY</p>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 32px 24px;">
                <p style="margin:0 0 10px;color:#667085;font-size:14px;">Hello ${safeName},</p>
                <h1 style="margin:0 0 16px;color:#202334;font-size:26px;line-height:1.25;">${escapeHtml(subject)}</h1>
                <p style="margin:0;color:#50576a;font-size:15px;line-height:1.7;">${escapeHtml(explanation)}</p>
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:28px 0 24px;">
                  <tr>
                    <td align="center" bgcolor="#e72125" style="border-radius:5px;">
                      <a href="${safeLink}" style="display:inline-block;padding:14px 22px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">${escapeHtml(action)}</a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0;color:#667085;font-size:13px;line-height:1.6;">This one-time link expires in <strong>one hour</strong>. If you did not request this, you can safely ignore this email.</p>
                <hr style="height:1px;margin:24px 0;border:0;background-color:#e8eaf0;">
                <p style="margin:0 0 8px;color:#667085;font-size:12px;line-height:1.5;">If the button does not work, copy and paste this link into your browser:</p>
                <p style="margin:0;overflow-wrap:anywhere;font-size:12px;line-height:1.6;"><a href="${safeLink}" style="color:#302f62;">${safeLink}</a></p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 32px;background-color:#f8f9fb;border-top:1px solid #e8eaf0;">
                <p style="margin:0;color:#7a8190;font-size:12px;line-height:1.6;">COCIN Academy Abuja<br>This is an automated account security message. Please do not reply.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, text, html };
}

module.exports = passwordEmail;