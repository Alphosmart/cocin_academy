require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");

const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/error");
const { requireTrustedOrigin } = require("./middleware/security");

const app = express();
app.set("trust proxy", 1);
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const devOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

function corsOrigin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin) || (process.env.NODE_ENV !== "production" && devOriginPattern.test(origin))) {
    return callback(null, true);
  }
  return callback(new Error(`CORS blocked origin: ${origin}`));
}

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => res.json({ status: "ok", database: "connected" }));
app.use("/api", requireTrustedOrigin);
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
