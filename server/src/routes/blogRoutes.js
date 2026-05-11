const router = require("express").Router();
const BlogPost = require("../models/BlogPost");
const crud = require("../controllers/crudController");
const { protect, adminOnly, optionalAuth } = require("../middleware/auth");
const { adminRateLimit } = require("../middleware/security");
const validate = require("../middleware/validate");
const { blogSchema } = require("../validators/schemas");

const publishedUnlessAdmin = (req) => (req.user?.role === "admin" ? {} : { status: "published" });

router.get("/", optionalAuth, crud.list(BlogPost, { publicFilter: publishedUnlessAdmin }));
router.get("/:slug", optionalAuth, crud.getBySlug(BlogPost, { publicFilter: publishedUnlessAdmin }));
router.post("/", adminRateLimit, protect, adminOnly, validate(blogSchema), crud.create(BlogPost));
router.put("/:id", adminRateLimit, protect, adminOnly, validate(blogSchema), crud.update(BlogPost));
router.delete("/:id", adminRateLimit, protect, adminOnly, crud.remove(BlogPost));

module.exports = router;
