const mongoose = require("mongoose");
const makeUniqueSlug = require("../utils/uniqueSlug");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    image: String,
    date: { type: Date, required: true },
    time: String,
    location: String,
    description: { type: String, required: true }
  },
  { timestamps: true }
);

eventSchema.pre("validate", async function setSlug() {
  if (!this.slug && this.title) this.slug = await makeUniqueSlug(this.constructor, this.title, this._id);
});

module.exports = mongoose.model("Event", eventSchema);
