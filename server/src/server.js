const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;
const RETRY_MS = 5000;

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`API running on port ${PORT}`);
  }
});

async function connectWithRetry() {
  try {
    await connectDB();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("MongoDB connection failed. Retrying in 5 seconds.");
      console.error(error.message);
    }
    setTimeout(connectWithRetry, RETRY_MS);
  }
}

connectWithRetry();
