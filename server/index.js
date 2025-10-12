import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_PORT = process.env.PORT || 5000;

const server = app.listen(DEFAULT_PORT, () => {
  console.log(`✅ Server running on port ${DEFAULT_PORT}`);
});

// ⚙️ Em caso de erro (porta já em uso)
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.warn(`⚠️  Port ${DEFAULT_PORT} is in use. Trying port 5050 instead...`);
    const fallbackPort = 5050;
    app.listen(fallbackPort, () => {
      console.log(`✅ Server running on fallback port ${fallbackPort}`);
    });
  } else {
    console.error("❌ Server error:", err);
  }
});
