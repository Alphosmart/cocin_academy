const router = require("express").Router();
const auditLog = require("../middleware/audit");

// Record all authenticated admin mutations across every resource.
router.use(auditLog());

router.use("/auth", require("./authRoutes"));
router.use("/settings", require("./settingsRoutes"));
router.use("/homepage", require("./homepageRoutes"));
router.use("/pages", require("./pageRoutes"));
router.use("/blogs", require("./blogRoutes"));
router.use("/gallery", require("./galleryRoutes"));
router.use("/events", require("./eventRoutes"));
router.use("/testimonials", require("./testimonialRoutes"));
router.use("/staff", require("./staffRoutes"));
router.use("/contact", require("./contactRoutes"));
router.use("/academics", require("./academicRoutes"));
router.use("/admissions", require("./admissionRoutes"));
router.use("/admission-applications", require("./admissionApplicationRoutes"));
router.use("/admission-payments", require("./admissionPaymentRoutes"));
router.use("/faqs", require("./faqRoutes"));
router.use("/uploads", require("./uploadRoutes"));
router.use("/users", require("./userRoutes"));
router.use("/audit-logs", require("./auditRoutes"));
router.use("/analytics", require("./analyticsRoutes"));
router.use("/files", require("./fileRoutes"));

module.exports = router;
