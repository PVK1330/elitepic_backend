const { sendEmail } = require("./email.service");
const db = require("../models");

const createNotification = async ({ userId, title, message, channel = "dashboard" }) => {
  return db.Notification.create({ userId, title, message, channel });
};

const notifyByEmail = async ({ email, title, message }) =>
  sendEmail({ to: email, subject: title, html: `<p>${message}</p>` });

module.exports = { createNotification, notifyByEmail };
