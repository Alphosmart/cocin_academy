const asyncHandler = require("../middleware/asyncHandler");
const { uploadToCloudinary } = require("../middleware/upload");

exports.uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Media file is required" });
  const baseUrl = process.env.PUBLIC_API_URL || `${req.protocol}://${req.get("host")}`;
  const result = await uploadToCloudinary(req.file, req.body.folder || "school-website", baseUrl);
  res.status(201).json(result);
});
