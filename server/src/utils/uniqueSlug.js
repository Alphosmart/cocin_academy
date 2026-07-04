const makeSlug = require("./slug");

async function makeUniqueSlug(Model, value, excludeId) {
  const base = makeSlug(value) || "content";
  let slug = base;
  let suffix = 2;

  while (await Model.exists({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

module.exports = makeUniqueSlug;
