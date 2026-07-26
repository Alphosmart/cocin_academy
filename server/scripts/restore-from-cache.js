/*
 * Restores content from a browser cache export.
 *
 * The public site stores every API response in localStorage under the
 * "cocin_cache:v1:" prefix. If a browser visited the live site before content was
 * lost, that cache is a usable copy of the real content.
 *
 * Step 1 — in that browser, open the live site, then run this in the DevTools console:
 *
 *     copy(JSON.stringify(Object.fromEntries(
 *       Object.entries(localStorage).filter(([k]) => k.startsWith("cocin_cache:v1:"))
 *     )))
 *
 *   Paste the result into a file, e.g. cache-export.json
 *
 * Step 2 — inspect what would be restored (no writes at all):
 *
 *     node scripts/restore-from-cache.js cache-export.json
 *
 * Step 3 — only when the report looks right, actually write it:
 *
 *     node scripts/restore-from-cache.js cache-export.json --write
 */

require("dotenv").config();
const fs = require("fs");
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");

const SiteSettings = require("../src/models/SiteSettings");
const HomepageContent = require("../src/models/HomepageContent");
const PageContent = require("../src/models/PageContent");
const BlogPost = require("../src/models/BlogPost");
const GalleryItem = require("../src/models/GalleryItem");
const Event = require("../src/models/Event");
const Testimonial = require("../src/models/Testimonial");
const StaffMember = require("../src/models/StaffMember");
const AcademicProgram = require("../src/models/AcademicProgram");
const AdmissionContent = require("../src/models/AdmissionContent");
const FAQ = require("../src/models/FAQ");

const CACHE_PREFIX = "cocin_cache:v1:";

// Singletons are replaced wholesale; collections are upserted per document so that
// anything created since the loss is kept rather than clobbered.
const singletons = {
  settings: SiteSettings,
  homepage: HomepageContent,
  admissions: AdmissionContent
};

const collections = {
  blogs: BlogPost,
  gallery: GalleryItem,
  events: Event,
  testimonials: Testimonial,
  staff: StaffMember,
  academics: AcademicProgram,
  faqs: FAQ
};

// Bundled defaults are merged into the cache by the client, so a cached document can
// contain placeholder values. Those are obvious enough to spot in the dry-run report.
function unwrap(raw) {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && "savedAt" in parsed ? parsed : { data: parsed, savedAt: null };
  } catch {
    return null;
  }
}

function stripMeta(doc) {
  const { _id, __v, createdAt, updatedAt, ...rest } = doc;
  return rest;
}

function summarize(value) {
  if (Array.isArray(value)) return `${value.length} item(s)`;
  if (value && typeof value === "object") {
    const filled = Object.entries(value).filter(([, v]) => v !== null && v !== undefined && v !== "" && !(Array.isArray(v) && !v.length));
    return `${filled.length} filled field(s)`;
  }
  return String(value);
}

async function main() {
  const [file, ...flags] = process.argv.slice(2);
  const write = flags.includes("--write");
  if (!file) {
    console.error("Usage: node scripts/restore-from-cache.js <cache-export.json> [--write]");
    process.exit(1);
  }

  const exported = JSON.parse(fs.readFileSync(file, "utf8"));
  const entries = Object.entries(exported)
    .filter(([key]) => key.startsWith(CACHE_PREFIX))
    .map(([key, raw]) => [key.slice(CACHE_PREFIX.length), unwrap(raw)])
    .filter(([, payload]) => payload && payload.data);

  if (!entries.length) {
    console.error(`No "${CACHE_PREFIX}" entries found in ${file}.`);
    process.exit(1);
  }

  console.log(`${write ? "RESTORING" : "DRY RUN (no writes)"} from ${file}\n`);
  for (const [key, { savedAt }] of entries) {
    const when = savedAt ? new Date(savedAt).toISOString() : "unknown";
    console.log(`  ${key.padEnd(28)} cached at ${when}`);
  }
  console.log("");

  await connectDB();
  let restored = 0;
  let skipped = 0;

  for (const [key, { data }] of entries) {
    // Page documents are cached per slug, e.g. "page:about", plus the welcome address.
    const pageSlug = key.startsWith("page:") ? key.slice(5) : key === "head-of-school-welcome" ? "head-of-school-welcome" : null;

    if (pageSlug && data && !Array.isArray(data)) {
      console.log(`page/${pageSlug}: ${summarize(data)}`);
      if (write) {
        await PageContent.findOneAndUpdate({ slug: pageSlug }, { ...stripMeta(data), slug: pageSlug }, { upsert: true, new: true, setDefaultsOnInsert: true });
      }
      restored += 1;
      continue;
    }

    if (singletons[key] && data && !Array.isArray(data)) {
      console.log(`${key}: ${summarize(data)}`);
      if (write) {
        const Model = singletons[key];
        const existing = await Model.findOne();
        if (existing) Object.assign(existing, stripMeta(data)), await existing.save();
        else await Model.create(stripMeta(data));
      }
      restored += 1;
      continue;
    }

    // Individual posts/events are cached per slug, e.g. "blog:first-day".
    const singleMatch = key.match(/^(blog|event):(.+)$/);
    if (singleMatch && data && !Array.isArray(data)) {
      const [, kind, slug] = singleMatch;
      const Model = kind === "blog" ? BlogPost : Event;
      console.log(`${kind}/${slug}: ${summarize(data)}`);
      if (write) {
        await Model.findOneAndUpdate({ slug }, { ...stripMeta(data), slug }, { upsert: true, new: true, setDefaultsOnInsert: true });
      }
      restored += 1;
      continue;
    }

    if (collections[key] && Array.isArray(data)) {
      const Model = collections[key];
      // Bundled fallbacks use "default-*" ids; those are placeholders, not real content.
      const real = data.filter((doc) => doc && doc._id && !String(doc._id).startsWith("default-"));
      console.log(`${key}: ${real.length} real document(s) (${data.length - real.length} bundled placeholder(s) ignored)`);
      if (write) {
        for (const doc of real) {
          await Model.findByIdAndUpdate(doc._id, stripMeta(doc), { upsert: true, new: true, setDefaultsOnInsert: true });
        }
      }
      restored += real.length;
      continue;
    }

    console.log(`${key}: skipped (no matching collection)`);
    skipped += 1;
  }

  console.log(`\n${write ? "Restored" : "Would restore"} ${restored} document(s); skipped ${skipped} cache entr(y/ies).`);
  if (!write) console.log("Re-run with --write to apply.");
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
