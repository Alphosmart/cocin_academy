// Turns plain URLs, emails, and phone numbers inside saved rich text into real
// links, and makes sure every link opens safely. The server sanitizer already
// allows <a href target rel>, so the result survives a round trip through the API.

const URL_PATTERN = /((?:https?:\/\/|www\.)[^\s<>()]+[^\s<>().,;:!?'"])|([\w.+-]+@[\w-]+\.[\w.-]+)/gi;

// Anything that is already a link, or is markup rather than prose, is left alone.
const SKIP_TAGS = new Set(["A", "SCRIPT", "STYLE", "IFRAME", "CODE", "PRE"]);

export function normalizeHref(value) {
  const href = String(value || "").trim();
  if (!href) return "";
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(href)) return href;
  if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(href)) return `mailto:${href}`;
  return `https://${href}`;
}

function isExternal(href) {
  if (/^(mailto:|tel:)/i.test(href)) return true;
  if (/^(\/|#)/.test(href)) return false;
  try {
    return new URL(href, window.location.origin).origin !== window.location.origin;
  } catch {
    return false;
  }
}

function applyLinkSafety(anchor) {
  const href = normalizeHref(anchor.getAttribute("href"));
  if (!href) return;
  anchor.setAttribute("href", href);
  if (isExternal(href) && !/^(mailto:|tel:)/i.test(href)) {
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");
  }
}

function linkifyTextNode(textNode, doc) {
  const text = textNode.nodeValue;
  if (!text || !URL_PATTERN.test(text)) return;
  URL_PATTERN.lastIndex = 0;

  const fragment = doc.createDocumentFragment();
  let lastIndex = 0;
  let match = URL_PATTERN.exec(text);
  while (match) {
    if (match.index > lastIndex) fragment.appendChild(doc.createTextNode(text.slice(lastIndex, match.index)));
    const anchor = doc.createElement("a");
    anchor.setAttribute("href", normalizeHref(match[0]));
    anchor.textContent = match[0];
    applyLinkSafety(anchor);
    fragment.appendChild(anchor);
    lastIndex = match.index + match[0].length;
    match = URL_PATTERN.exec(text);
  }
  if (lastIndex < text.length) fragment.appendChild(doc.createTextNode(text.slice(lastIndex)));
  textNode.parentNode.replaceChild(fragment, textNode);
}

export function enhanceRichText(html) {
  if (!html || typeof html !== "string") return html || "";
  if (typeof window === "undefined" || typeof window.DOMParser === "undefined") return html;

  const doc = new DOMParser().parseFromString(`<div id="root">${html}</div>`, "text/html");
  const root = doc.getElementById("root");
  if (!root) return html;

  root.querySelectorAll("a[href]").forEach(applyLinkSafety);

  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.parentElement || SKIP_TAGS.has(node.parentElement.tagName)) continue;
    if (node.parentElement.closest("a")) continue;
    textNodes.push(node);
  }
  textNodes.forEach((node) => linkifyTextNode(node, doc));

  return root.innerHTML;
}
