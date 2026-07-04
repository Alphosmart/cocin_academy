const AuditLog = require("../models/AuditLog");

const METHOD_ACTION = { POST: "create", PUT: "update", PATCH: "update", DELETE: "delete" };

// Derive a human-friendly resource name from the mounted base URL, e.g.
// "/api/blogs" -> "blogs".
function resourceFromReq(req) {
  const base = (req.baseUrl || "").split("/").filter(Boolean).pop();
  return base || "unknown";
}

// Records successful admin mutations. Attach after `protect`/`adminOnly` so
// req.user is available. Reads any extra context left on res.locals.audit by
// the controller (resourceId, title, count).
function auditLog(action) {
  return (req, res, next) => {
    res.on("finish", () => {
      if (res.statusCode >= 400) return;
      const method = req.method.toUpperCase();
      const extra = res.locals.audit || {};
      // Controllers may override the action (e.g. bulk POST is really a delete).
      const resolvedAction = extra.action || action || METHOD_ACTION[method];
      if (!resolvedAction) return; // don't log GETs
      // Only track authenticated admin activity (login/logout pass an explicit action).
      if (!req.user && !action) return;
      const detailParts = [];
      if (extra.title) detailParts.push(String(extra.title));
      if (typeof extra.count === "number") detailParts.push(`${extra.count} item(s)`);

      AuditLog.create({
        user: req.user?._id,
        userName: req.user?.name,
        userEmail: req.user?.email,
        action: resolvedAction,
        resource: resourceFromReq(req),
        resourceId: extra.resourceId ? String(extra.resourceId) : req.params.id,
        detail: detailParts.join(" — ") || undefined,
        method,
        path: req.originalUrl,
        status: res.statusCode,
        ip: req.ip
      }).catch((error) => console.error("Audit log failed:", error.message));
    });
    next();
  };
}

module.exports = auditLog;
