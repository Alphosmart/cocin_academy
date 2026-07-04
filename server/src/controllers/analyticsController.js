const { z } = require("zod");
const PageView = require("../models/PageView");
const AuditLog = require("../models/AuditLog");
const BlogPost = require("../models/BlogPost");
const Event = require("../models/Event");
const GalleryItem = require("../models/GalleryItem");
const StaffMember = require("../models/StaffMember");
const ContactMessage = require("../models/ContactMessage");
const asyncHandler = require("../middleware/asyncHandler");

const trackSchema = z.object({
  path: z.string().trim().min(1).max(300),
  referrer: z.string().trim().max(300).optional().default("")
});

// Public: record a page view. Fire-and-forget from the client.
exports.track = asyncHandler(async (req, res) => {
  const { path, referrer } = trackSchema.parse(req.body);
  // Ignore admin routes — analytics is about the public site.
  if (!path.startsWith("/admin")) {
    await PageView.create({ path, referrer });
  }
  res.status(201).json({ ok: true });
});

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Admin: aggregated dashboard summary.
exports.summary = asyncHandler(async (req, res) => {
  const since30 = daysAgo(30);
  const since7 = daysAgo(7);

  const [totalViews, views7, views30, topPages, dailySeries, contentCounts, unreadMessages, recentActivity] = await Promise.all([
    PageView.countDocuments(),
    PageView.countDocuments({ createdAt: { $gte: since7 } }),
    PageView.countDocuments({ createdAt: { $gte: since30 } }),
    PageView.aggregate([
      { $group: { _id: "$path", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    PageView.aggregate([
      { $match: { createdAt: { $gte: since30 } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]),
    Promise.all([
      BlogPost.countDocuments(),
      Event.countDocuments(),
      GalleryItem.countDocuments(),
      StaffMember.countDocuments()
    ]),
    ContactMessage.countDocuments({ isRead: false }),
    AuditLog.find().sort("-createdAt").limit(10)
  ]);

  res.json({
    views: { total: totalViews, last7: views7, last30: views30 },
    topPages: topPages.map((p) => ({ path: p._id, count: p.count })),
    daily: dailySeries.map((d) => ({ date: d._id, count: d.count })),
    content: {
      blogs: contentCounts[0],
      events: contentCounts[1],
      gallery: contentCounts[2],
      staff: contentCounts[3]
    },
    unreadMessages,
    recentActivity
  });
});
