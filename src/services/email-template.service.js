const fs = require('fs');
const path = require('path');

class EmailTemplateService {
  constructor() {
    this.templatesPath = path.join(__dirname, '../templates/emails');
  }

  /**
   * Load email template from file
   */
  loadTemplate(templateName) {
    try {
      const templatePath = path.join(this.templatesPath, `${templateName}.html`);
      return fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
      console.error(`Failed to load template ${templateName}:`, error);
      throw new Error(`Email template ${templateName} not found`);
    }
  }

  /**
   * Replace placeholders in template with actual values
   */
  replacePlaceholders(template, data) {
    let result = template;
    
    // Replace all {{placeholder}} patterns with actual values
    Object.keys(data).forEach(key => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(placeholder, data[key] || '');
    });
    
    return result;
  }

  /**
   * Get OTP verification email template
   */
  getOTPVerificationTemplate(otp, userName) {
    const template = this.loadTemplate('otp-verification');
    return this.replacePlaceholders(template, {
      otp,
      userName
    });
  }

  /**
   * Get welcome email template
   */
  getWelcomeTemplate(userName, email, loginUrl) {
    const template = this.loadTemplate('welcome-email');
    return this.replacePlaceholders(template, {
      userName,
      email,
      loginUrl
    });
  }

  /**
   * Get password reset email template with OTP
   */
  getPasswordResetTemplate(otp, userName) {
    const template = this.loadTemplate('password-reset');
    return this.replacePlaceholders(template, {
      otp,
      userName
    });
  }

  /**
   * Get account locked email template (for future use)
   */
  getAccountLockedTemplate(userName) {
    const template = this.loadTemplate('account-locked');
    return this.replacePlaceholders(template, {
      userName
    });
  }
}

module.exports = new EmailTemplateService();
