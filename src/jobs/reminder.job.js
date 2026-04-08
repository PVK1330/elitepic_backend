const cron = require("node-cron");
const { createNotification } = require("../services/notification.service");
const db = require("../models");

const scheduleReminderJob = () => {
  cron.schedule("0 9 * * *", async () => {
    const overdue = await db.Task.findAll({
      where: { dueDate: { [db.Sequelize.Op.lt]: new Date() }, status: { [db.Sequelize.Op.ne]: "DONE" } }
    });
    for (const task of overdue) {
      await createNotification({
        userId: task.assignedToId,
        title: "Overdue task reminder",
        message: `Task ${task.title} is overdue`
      });
    }
  });
};

module.exports = { scheduleReminderJob };
