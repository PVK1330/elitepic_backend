const nodemailer = require("nodemailer");
const { smtp } = require("../config/env");
const emailTemplateService = require("./email-template.service");

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: false,
  auth: { user: smtp.user, pass: smtp.pass }
});

/**
 * Send OTP verification email
 */
const sendOTPVerificationEmail = async (to, otp, userName) => {
  const html = emailTemplateService.getOTPVerificationTemplate(otp, userName);
  const path = require('path');
  
  return await transporter.sendMail({
    from: smtp.from,
    to,
    subject: 'Verify Your Email - EPiC System',
    html,
    attachments: [{
      filename: 'logo.png',
      path: path.join(__dirname, '../assest/images/logo.png'),
      cid: 'logo'
    }]
  });
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (to, userName, email, loginUrl) => {
  const html = emailTemplateService.getWelcomeTemplate(userName, email, loginUrl);
  const path = require('path');
  
  return await transporter.sendMail({
    from: smtp.from,
    to,
    subject: 'Welcome to EPiC - Account Activated!',
    html,
    attachments: [{
      filename: 'logo.png',
      path: path.join(__dirname, '../assest/images/logo.png'),
      cid: 'logo'
    }]
  });
};

/**
 * Send password reset email with OTP
 */
const sendPasswordResetEmail = async (to, otp, userName) => {
  const html = emailTemplateService.getPasswordResetTemplate(otp, userName);
  const path = require('path');
  
  return await transporter.sendMail({
    from: smtp.from,
    to,
    subject: 'Reset Your Password - EPiC System',
    html,
    attachments: [{
      filename: 'logo.png',
      path: path.join(__dirname, '../assest/images/logo.png'),
      cid: 'logo'
    }]
  });
};

/**
 * Send account locked email (for future use)
 */
const sendAccountLockedEmail = async (to, userName) => {
  const html = emailTemplateService.getAccountLockedTemplate(userName);
  
  return await transporter.sendMail({
    from: smtp.from,
    to,
    subject: 'Account Locked - EPiC System',
    html
  });
};

/**
 * Generic email sender (backward compatibility)
 */
const sendEmail = async ({ to, subject, html }) =>
  transporter.sendMail({ from: smtp.from, to, subject, html });

module.exports = {
  sendEmail,
  sendOTPVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendAccountLockedEmail
};
