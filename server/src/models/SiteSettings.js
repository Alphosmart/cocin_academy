const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    schoolName: { type: String, default: "COCIN Academy" },
    motto: { type: String, default: "Building lives on the Solid Rock" },
    logo: String,
    favicon: String,
    primaryColor: { type: String, default: "#60939e" },
    secondaryColor: { type: String, default: "#752636" },
    email: { type: String, default: "cocinacademy07@gmail.com" },
    phone: { type: String, default: "07046272361, 09018690022, 08180705629" },
    whatsapp: { type: String, default: "+2347046272361" },
    address: { type: String, default: "900241 Cadastral Street, Plot 5/7 Durumi District, Area 1, F.C.T. Abuja" },
    portalUrl: { type: String, default: "https://portal.example.com" },
    facebookUrl: String,
    instagramUrl: String,
    youtubeUrl: String,
    tiktokUrl: String,
    xUrl: String,
    googleMapEmbed: String,
    footerText: { type: String, default: "Training children through total education, one child at a time for Christ." },
    seoTitle: { type: String, default: "COCIN Academy Abuja" },
    seoDescription: { type: String, default: "A Biblically-based Christian school in Abuja serving learners from Prekindergarten to Grade 12." }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);
