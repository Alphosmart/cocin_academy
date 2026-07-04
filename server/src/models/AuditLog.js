const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: String,
    userEmail: String,
    action: { type: String, enum: ["create", "update", "delete", "login", "logout", "bulk", "reorder", "other"], default: "other" },
    resource: String,
    resourceId: String,
    detail: String,
    method: String,
    path: String,
    status: Number,
    ip: String
  },
  { timestamps: true }
);

// Keep the collection bounded — logs older than 90 days expire automatically.
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
