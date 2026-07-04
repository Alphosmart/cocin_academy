// Smoothly scroll to the top of the active scroll context. In the admin panel
// the content lives in an independently-scrolling column ([data-scroll-container]);
// on the public site (and mobile) the window scrolls.
export function scrollToTop() {
  const container = document.querySelector("[data-scroll-container]");
  if (container && container.scrollHeight > container.clientHeight) {
    container.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
