const mongoose = require("mongoose");

const academicProgramSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    level: String,
    description: { type: String, required: true },
    image: String,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AcademicProgram", academicProgramSchema);
