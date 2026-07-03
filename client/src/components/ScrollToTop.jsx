import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Resets the window scroll position on route change so each new page starts at
// the top. In-page anchor links (e.g. /#faith) scroll to their target instead.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
