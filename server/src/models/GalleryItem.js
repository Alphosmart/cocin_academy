const mongoose = require("mongoose");

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    image: { type: String, required: true },
    category: { type: String, default: "Campus" },
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("GalleryItem", galleryItemSchema);
