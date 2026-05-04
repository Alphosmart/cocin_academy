const router = require("express").Router();

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
router.use("/faqs", require("./faqRoutes"));
router.use("/uploads", require("./uploadRoutes"));
router.use("/users", require("./userRoutes"));

module.exports = router;
