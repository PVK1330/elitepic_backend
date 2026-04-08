const nodemailer = require("nodemailer");
const { smtp } = require("../config/env");

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: false,
  auth: { user: smtp.user, pass: smtp.pass }
});

const sendEmail = async ({ to, subject, html }) =>
  transporter.sendMail({ from: smtp.from, to, subject, html });

module.exports = { sendEmail };
