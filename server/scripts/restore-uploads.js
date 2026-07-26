/*
 * Re-attaches uploaded Cloudinary files to database records after content loss.
 *
 * The files themselves were never deleted from Cloudinary — only the documents that
 * referenced them. This script rebuilds those references.
 *
 * Two sources are combined:
 *   1. Cloudinary  — the surviving files, with upload timestamps.
 *   2. auditlogs   — surviving audit trail, which preserved record _ids and titles.
 *
 * Attribution for the records below is inferred from upload timestamps sitting
 * immediately before the matching edit in the audit trail. Anything not confidently
 * attributed is still restored, as a gallery item under "Restored uploads", so no file
 * is left orphaned — retitle those in the admin dashboard.
 *
 * IMPORTANT: this Cloudinary account is shared with Rehoboth Prime. Assets under
 * rehoboth-gallery/ and Rehoboth-prime-Years/ are excluded, as is anything still
 * referenced by Rehoboth's own database (pass a JSON array of its public_ids via
 * --exclude=<file> to re-check that).
 *
 * Usage:
 *   node scripts/restore-uploads.js                    # dry run, no writes
 *   node scripts/restore-uploads.js --write            # apply
 *   node scripts/restore-uploads.js --exclude=ids.json # extra ids to skip
 */

require("dotenv").config();
const fs = require("fs");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const connectDB = require("../src/config/db");

const SiteSettings = require("../src/models/SiteSettings");
const HomepageContent = require("../src/models/HomepageContent");
const GalleryItem = require("../src/models/GalleryItem");
const BlogPost = require("../src/models/BlogPost");
const Event = require("../src/models/Event");

const UPLOAD_FOLDER = "school-website";
const OTHER_SCHOOL_PREFIXES = ["rehoboth-gallery/", "Rehoboth-prime-Years", "samples/"];

// public_id -> where the timeline says it belonged. Titles and _ids come from auditlogs.
const attribution = {
  "school-website/g4zabn1hwdylxkaxkogv": { kind: "logo" },
  "school-website/cil3xjjkoju5jfrefoxc": { kind: "gallery", _id: "69fa23e6e04ecb3e8f5f4472", title: "Logo" },
  "school-website/yjovhvvd5kjbx5ygt9mn": { kind: "event", _id: "6a4f5d3929743c9f30ca4b73", title: "Annual General Meeting (AGM)" },
  "school-website/qsgj0rey6jebaa7scqc0": { kind: "event", _id: "6a514a7e7261b2fdd052fab6", title: "Graduation Ceremony and End of Session" },
  "school-website/cjhtvkouvs3px8bxkxs7": { kind: "blog", _id: "6a52a170b6081ed777a2fe26", title: "A.C.E. COCIN Academy theme for the 2026-2027 school year." },
  "school-website/l7ru0kuaguxbjpch7raa": { kind: "event", _id: "6a52a540b6081ed777a2ffa2", title: "A.C.E. COCIN Academy theme for the 2026-2027 school year." },
  "school-website/zt748as71pm3bd7hjfy2": { kind: "blog", _id: "6a59463d8a29efca931e8426", title: "Graduation and End of Session Ceremony" }
};

function slugify(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}

async function listAssets(excluded) {
  const assets = [];
  for (const resourceType of ["image", "video"]) {
    let cursor;
    do {
      const result = await cloudinary.api.resources({ resource_type: resourceType, type: "upload", prefix: UPLOAD_FOLDER, max_results: 500, next_cursor: cursor });
      result.resources.forEach((item) => {
        if (OTHER_SCHOOL_PREFIXES.some((prefix) => item.public_id.startsWith(prefix))) return;
        if (excluded.has(item.public_id)) return;
        assets.push({ publicId: item.public_id, url: item.secure_url, resourceType, createdAt: item.created_at, width: item.width, height: item.height });
      });
      cursor = result.next_cursor;
    } while (cursor);
  }
  return assets.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

async function main() {
  const flags = process.argv.slice(2);
  const write = flags.includes("--write");
  const excludeFile = flags.find((f) => f.startsWith("--exclude="))?.split("=")[1];
  const excluded = new Set(excludeFile ? JSON.parse(fs.readFileSync(excludeFile, "utf8")) : []);

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const assets = await listAssets(excluded);
  console.log(`${write ? "RESTORING" : "DRY RUN (no writes)"} — ${assets.length} surviving upload(s) in ${UPLOAD_FOLDER}/\n`);

  await connectDB();

  const plan = { logo: [], event: [], blog: [], gallery: [], heroVideo: [] };
  for (const asset of assets) {
    const known = attribution[asset.publicId];
    if (known) plan[known.kind === "logo" ? "logo" : known.kind].push({ asset, ...known });
    else if (asset.resourceType === "video") plan.heroVideo.push({ asset });
    else plan.gallery.push({ asset });
  }

  for (const entry of plan.logo) {
    console.log(`settings.logo         <- ${entry.asset.publicId}`);
    if (write) {
      const settings = (await SiteSettings.findOne()) || new SiteSettings();
      settings.logo = entry.asset.url;
      if (!settings.favicon) settings.favicon = entry.asset.url;
      await settings.save();
    }
  }

  for (const entry of plan.event) {
    console.log(`event  "${entry.title}"  <- ${entry.asset.publicId}`);
    if (write) {
      await Event.findByIdAndUpdate(
        entry._id,
        { $set: { title: entry.title, image: entry.asset.url, slug: slugify(entry.title) }, $setOnInsert: { date: new Date(entry.asset.createdAt) } },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }
  }

  for (const entry of plan.blog) {
    console.log(`blog   "${entry.title}"  <- ${entry.asset.publicId}`);
    if (write) {
      await BlogPost.findByIdAndUpdate(
        entry._id,
        { $set: { title: entry.title, featuredImage: entry.asset.url, slug: slugify(entry.title) }, $setOnInsert: { status: "draft" } },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }
  }

  // Videos were used as homepage hero media; keep them reachable as inactive slides
  // rather than guessing which one was live.
  if (plan.heroVideo.length) {
    console.log(`\nhomepage hero slides  <- ${plan.heroVideo.length} video(s), added hidden (untick/tick "Show this slide" to choose)`);
    plan.heroVideo.forEach((e) => console.log(`   ${e.asset.publicId}`));
    if (write) {
      const homepage = (await HomepageContent.findOne()) || new HomepageContent();
      const existing = new Set((homepage.heroSlides || []).map((s) => s.media));
      plan.heroVideo.forEach((entry) => {
        if (existing.has(entry.asset.url)) return;
        homepage.heroSlides.push({ title: "", subtitle: "", media: entry.asset.url, mediaType: "video", isActive: false });
      });
      await homepage.save();
    }
  }

  console.log(`\ngallery items  <- ${plan.gallery.length} image(s)`);
  for (const entry of plan.gallery) {
    const known = entry.title ? entry.title : `Restored upload ${entry.asset.createdAt.slice(0, 10)}`;
    const category = entry.title ? undefined : "Restored uploads";
    console.log(`   ${entry.asset.publicId}  as "${known}"`);
    if (write) {
      if (entry._id) {
        await GalleryItem.findByIdAndUpdate(entry._id, { $set: { title: known, image: entry.asset.url, ...(category ? { category } : {}) } }, { upsert: true, setDefaultsOnInsert: true });
      } else {
        const already = await GalleryItem.findOne({ image: entry.asset.url });
        if (!already) await GalleryItem.create({ title: known, image: entry.asset.url, category });
      }
    }
  }

  console.log(`\n${write ? "Done." : "Nothing was written. Re-run with --write to apply."}`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
