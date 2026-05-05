const sanitize = require("sanitize-html");

const allowedTags = [
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "i",
  "iframe",
  "li",
  "ol",
  "p",
  "pre",
  "strong",
  "u",
  "ul"
];

const allowedAttributes = {
  a: ["href", "name", "target", "rel"],
  iframe: ["src", "width", "height", "loading", "referrerpolicy", "allowfullscreen"]
};

function sanitizeHtml(value) {
  if (typeof value !== "string") return value;
  return sanitize(value, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedIframeHostnames: ["www.google.com", "maps.google.com"],
    exclusiveFilter(frame) {
      return frame.tag === "iframe" && !frame.attribs.src;
    },
    transformTags: {
      a: sanitize.simpleTransform("a", { rel: "noopener noreferrer" }, true)
    }
  });
}

function sanitizeObject(input) {
  if (Array.isArray(input)) return input.map(sanitizeObject);
  if (!input || typeof input !== "object") return sanitizeHtml(input);
  return Object.fromEntries(
    Object.entries(input)
      .filter(([key]) => !key.startsWith("$") && !key.includes("."))
      .map(([key, value]) => [key, sanitizeObject(value)])
  );
}

module.exports = { sanitizeHtml, sanitizeObject };
