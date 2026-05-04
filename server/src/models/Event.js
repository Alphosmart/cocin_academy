const mongoose = require("mongoose");
const makeSlug = require("../utils/slug");

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

eventSchema.pre("validate", function setSlug(next) {
  if (!this.slug && this.title) this.slug = makeSlug(this.title);
  next();
});

module.exports = mongoose.model("Event", eventSchema);
