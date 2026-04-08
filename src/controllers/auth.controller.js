const { User, Role } = require("../models");
const { generateToken } = require("../utils/jwt");
const { sendOTPVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } = require("../services/email.service");
const crypto = require('crypto');

exports.register = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role_id,
      country_code,
      mobile,
      dob,
      country,
      city,
      address,
      pincode,
    } = req.body;

    // Input validation
    if (!first_name || !email || !password) {
      return res.status(400).json({ 
        message: "Missing required fields",
        required: ["first_name", "email", "password"]
      });
    }

    if (typeof first_name !== 'string' || first_name.trim().length === 0) {
      return res.status(400).json({ message: "First name must be a non-empty string" });
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Validate role_id if provided
    if (role_id) {
      const role = await Role.findByPk(role_id);
      if (!role) {
        return res.status(400).json({ message: "Invalid role_id" });
      }
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      first_name: first_name.trim(),
      last_name: last_name ? last_name.trim() : null,
      email: email.trim().toLowerCase(),
      password,
      role_id,
      country_code: country_code || null,
      mobile: mobile || null,
      dob: dob ? new Date(dob) : null,
      country: country || null,
      city: city || null,
      address: address || null,
      pincode: pincode || null,
      otp_code: otp,
      otp_expiry: otpExpiry,
      is_email_verified: false,
    });

    // Send OTP verification email
    try {
      await sendOTPVerificationEmail(email, otp, first_name);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      // Continue with registration even if email fails
    }

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;
    delete userResponse.otp_code;

    res.status(201).json({
      message: "User registered successfully. Please check your email for OTP verification.",
      user: userResponse,
      requires_verification: true
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required",
        required: ["email", "password"]
      });
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    if (typeof password !== 'string' || password.length === 0) {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() },
      include: [{ model: Role, as: "role" }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.is_locked) {
      return res.status(403).json({ message: "Account locked" });
    }

    if (!user.is_email_verified) {
      return res.status(403).json({ 
        message: "Email not verified. Please check your email and verify your account.",
        requires_verification: true
      });
    }

    const isValid = await user.validPassword(password);

    if (!isValid) {
      await user.increment("login_attempts");

      if (user.login_attempts >= 5) {
        await user.update({ is_locked: true });
      }

      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Reset attempts
    await user.update({
      login_attempts: 0,
      last_login: new Date(),
    });

    const token = generateToken(user);

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Remove password from response
    const userResponse = req.user.toJSON();
    delete userResponse.password;

    res.json(userResponse);
  } catch (err) {
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Input validation
    if (!email || !otp) {
      return res.status(400).json({ 
        message: "Email and OTP are required",
        required: ["email", "otp"]
      });
    }

    const user = await User.findOne({
      where: { 
        email: email.trim().toLowerCase(),
        otp_code: otp,
        is_email_verified: false
      },
      include: [{ model: Role, as: "role" }]
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP or email" });
    }

    // Check if OTP has expired
    if (user.otp_expiry && new Date() > new Date(user.otp_expiry)) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Mark email as verified and clear OTP
    await user.update({
      is_email_verified: true,
      is_otp_verified: true,
      otp_code: null,
      otp_expiry: null
    });

    // Send welcome email
    try {
      const loginUrl = process.env.FRONTEND_URL || 'http://localhost:3000/login';
      await sendWelcomeEmail(email, `${user.first_name} ${user.last_name || ''}`.trim(), email, loginUrl);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Continue with verification even if email fails
    }

    // Generate token for auto-login
    const token = generateToken(user);

    // Fetch fresh user data after update to get correct is_otp_verified value
    const updatedUser = await User.findOne({
      where: { id: user.id },
      include: [{ model: Role, as: "role" }]
    });

    // Remove password from response
    const userResponse = updatedUser.toJSON();
    delete userResponse.password;

    res.json({
      message: "Email verified successfully. Welcome to EPiC!",
      token,
      user: userResponse
    });
  } catch (err) {
    next(err);
  }
};

exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.is_email_verified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.update({
      otp_code: otp,
      otp_expiry: otpExpiry
    });

    // Send OTP email
    try {
      await sendOTPVerificationEmail(email, otp, user.first_name);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.json({
      message: "OTP has been resent to your email",
      email: email
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        message: "Email is required",
        required: ["email"]
      });
    }

    if (typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    const user = await User.findOne({
      where: { email: email.trim().toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP for password reset
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await user.update({
      otp_code: otp,
      otp_expiry: otpExpiry,
      is_otp_verified: false // Reset OTP verification for password reset
    });

    // Send password reset OTP email
    try {
      await sendPasswordResetEmail(email, otp, `${user.first_name} ${user.last_name || ''}`.trim());
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
      return res.status(500).json({ message: "Failed to send password reset email" });
    }

    res.json({
      message: "Password reset OTP has been sent to your email",
      email: email
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Input validation
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ 
        message: "Email, OTP, and new password are required",
        required: ["email", "otp", "newPassword"]
      });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }

    // Find user with OTP
    const user = await User.findOne({
      where: { 
        email: email.trim().toLowerCase(),
        otp_code: otp
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP or email" });
    }

    // Check if OTP has expired
    if (user.otp_expiry && new Date() > new Date(user.otp_expiry)) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Update password and clear OTP
    await user.update({
      password: newPassword, // Will be hashed by model hook
      otp_code: null,
      otp_expiry: null,
      is_otp_verified: true,
      login_attempts: 0,
      is_locked: false
    });

    res.json({
      message: "Password reset successfully. You can now login with your new password."
    });
  } catch (err) {
    next(err);
  }
};