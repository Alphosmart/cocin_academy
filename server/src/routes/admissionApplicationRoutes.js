const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const ctrl = require("../controllers/admissionApplicationController");
const { protect, adminOnly } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");
const { admissionDocumentUpload, MAX_ADMISSION_DOCUMENTS } = require("../middleware/upload");

const admissionApplicationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === "production" ? 5 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many admission applications. Please wait a few minutes and try again." }
});

router.post("/", admissionApplicationLimiter, admissionDocumentUpload.array("documents", MAX_ADMISSION_DOCUMENTS), ctrl.createApplication);
router.get("/", protect, adminOnly, ctrl.listApplications);
router.get("/:id/download", protect, adminOnly, ctrl.downloadApplication);
router.get("/:id", protect, adminOnly, ctrl.getApplication);
router.delete("/:id", adminRateLimit, protect, adminOnly, ctrl.deleteApplication);

module.exports = router;
