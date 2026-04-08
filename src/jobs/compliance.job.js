const cron = require("node-cron");
const { createNotification } = require("../services/notification.service");
const db = require("../models");

const WINDOW_DAYS = [120, 90, 60, 30];

const scheduleComplianceJob = () => {
  cron.schedule("0 8 * * *", async () => {
    const records = await db.Compliance.findAll({ include: [{ model: db.User, as: "user" }] });
    const now = new Date();
    for (const record of records) {
      if (!record.visaExpiryDate) continue;
      const days = Math.ceil((new Date(record.visaExpiryDate) - now) / 86400000);
      if (WINDOW_DAYS.includes(days)) {
        await createNotification({
          userId: record.userId,
          title: "Visa expiry alert",
          message: `Visa expires in ${days} days`
        });
      }
    }
  });
};

module.exports = { scheduleComplianceJob };
