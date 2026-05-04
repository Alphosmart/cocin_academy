const router = require("express").Router();
const BlogPost = require("../models/BlogPost");
const crud = require("../controllers/crudController");
const { protect, adminOnly, optionalAuth } = require("../middleware/auth");

const publishedUnlessAdmin = (req) => (req.user?.role === "admin" ? {} : { status: "published" });

router.get("/", optionalAuth, crud.list(BlogPost, { publicFilter: publishedUnlessAdmin }));
router.get("/:slug", optionalAuth, crud.getBySlug(BlogPost, { publicFilter: publishedUnlessAdmin }));
router.post("/", protect, adminOnly, crud.create(BlogPost));
router.put("/:id", protect, adminOnly, crud.update(BlogPost));
router.delete("/:id", protect, adminOnly, crud.remove(BlogPost));

module.exports = router;
