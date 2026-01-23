require("dotenv").config();
const app = require("./app");
const { initDb } = require("./models");

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    await initDb();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`API running on http://0.0.0.0:${PORT}`);
    });

  } catch (error) {
    console.error("DB init error:", error);
  }
};

start();
