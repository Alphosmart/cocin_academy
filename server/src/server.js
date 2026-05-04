const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start API: could not connect to MongoDB.");
    console.error(error.message);
    process.exit(1);
  });
