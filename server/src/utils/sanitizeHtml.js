function sanitizeHtml(value) {
  if (typeof value !== "string") return value;
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\sjavascript:/gi, "");
}

function sanitizeObject(input) {
  if (Array.isArray(input)) return input.map(sanitizeObject);
  if (!input || typeof input !== "object") return sanitizeHtml(input);
  return Object.fromEntries(Object.entries(input).map(([key, value]) => [key, sanitizeObject(value)]));
}

module.exports = { sanitizeHtml, sanitizeObject };
