import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import http from "../api/http";

// Fire-and-forget page-view tracking for the public site. Records one view per
// route change; failures are ignored so analytics never affects the visitor.
export function usePageView() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;
    http.post("/analytics/track", {
      path: location.pathname,
      referrer: typeof document !== "undefined" ? document.referrer : ""
    }).catch(() => {});
  }, [location.pathname]);
}
