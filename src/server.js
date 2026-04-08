const app = require("./app");
const { connectDB } = require("./config/db");
const { port } = require("./config/env");
const { scheduleReminderJob } = require("./jobs/reminder.job");
const { scheduleComplianceJob } = require("./jobs/compliance.job");

(async () => {
  await connectDB();
  scheduleReminderJob();
  scheduleComplianceJob();
  app.listen(port, () => console.log(`Server running on ${port}`));
})();

