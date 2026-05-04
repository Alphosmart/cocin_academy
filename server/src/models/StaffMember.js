const mongoose = require("mongoose");

const staffMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    biography: String,
    qualification: String,
    image: String,
    email: String,
    linkedinUrl: String,
    xUrl: String,
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StaffMember", staffMemberSchema);
