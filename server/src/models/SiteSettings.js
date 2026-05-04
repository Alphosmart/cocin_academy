const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    schoolName: { type: String, default: "Bright Future Academy" },
    motto: { type: String, default: "Learning today, leading tomorrow" },
    logo: String,
    favicon: String,
    primaryColor: { type: String, default: "#0f766e" },
    secondaryColor: { type: String, default: "#f59e0b" },
    email: { type: String, default: "info@brightfuture.edu" },
    phone: { type: String, default: "+234 800 000 0000" },
    whatsapp: { type: String, default: "+2348000000000" },
    address: { type: String, default: "1 Education Road, Lagos, Nigeria" },
    portalUrl: { type: String, default: "https://portal.example.com" },
    facebookUrl: String,
    instagramUrl: String,
    youtubeUrl: String,
    tiktokUrl: String,
    xUrl: String,
    googleMapEmbed: String,
    footerText: { type: String, default: "Nurturing confident learners and responsible leaders." },
    seoTitle: { type: String, default: "Bright Future Academy" },
    seoDescription: { type: String, default: "A professional school committed to academic excellence and character." }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
