import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    const fallbackPort = 5050;
    console.warn(`⚠️ Port ${PORT} is in use. Trying fallback port ${fallbackPort}...`);
    app.listen(fallbackPort, () => {
      console.log(`✅ Server running on fallback port ${fallbackPort}`);
    });
  } else {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  }
});