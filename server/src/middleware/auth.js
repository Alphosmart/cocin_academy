const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");
const { getAuthCookie } = require("../utils/authCookie");
const { noStore } = require("./security");

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : getAuthCookie(req);
  if (!token) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    throw error;
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");
  if (!user || !user.isActive) {
    const error = new Error("Invalid authentication token");
    error.statusCode = 401;
    throw error;
  }
  req.user = user;
  noStore(req, res, next);
});

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    const error = new Error("Admin access required");
    error.statusCode = 403;
    return next(error);
  }
  next();
};

const optionalAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : getAuthCookie(req);
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (user?.isActive) req.user = user;
  } catch (error) {
    req.user = null;
  }
  next();
});

module.exports = { protect, adminOnly, optionalAuth };
