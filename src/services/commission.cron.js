console.log("Commission cron initialized");
const cron = require("node-cron");
const { Op } = require("sequelize");
const { Commission } = require("../models");

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const result = await Commission.update(
      { status: "approved" },
      {
        where: {
          status: "pending",
          available_at: {
            [Op.lte]: now
          }
        }
      }
    );

    if (result[0] > 0) {
      console.log(`Commissions released: ${result[0]}`);
    }

  } catch (error) {
    console.error("Commission cron failed:", error.message);
  }
});