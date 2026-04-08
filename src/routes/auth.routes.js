const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Register new user
router.post("/register", authController.register);

// Login user
router.post("/login", authController.login);

// Get current user
router.get("/me", authMiddleware, authController.me);

// Verify OTP
router.post("/verify-otp", authController.verifyOTP);

// Resend OTP
router.post("/resend-otp", authController.resendOTP);

// Forgot password
router.post("/forgot-password", authController.forgotPassword);

// Reset password
router.post("/reset-password", authController.resetPassword);

module.exports = router;