const slugify = require("slugify");

module.exports = function makeSlug(value) {
  return slugify(value || "", { lower: true, strict: true, trim: true });
};
