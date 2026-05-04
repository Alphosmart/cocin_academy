const asyncHandler = require("../middleware/asyncHandler");
const { uploadToCloudinary } = require("../middleware/upload");

exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Image file is required" });
  const result = await uploadToCloudinary(req.file, req.body.folder || "school-website");
  res.status(201).json(result);
});
