const { User } = require("../models");
const { generateToken } = require("../utils/jwt");

exports.register = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role_id,
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

    // TODO: Add role_id validation when Role model is created
    // if (role_id) {
    //   const role = await Role.findByPk(role_id);
    //   if (!role) {
    //     return res.status(400).json({ message: "Invalid role_id" });
    //   }
    // }

    const user = await User.create({
      first_name: first_name.trim(),
      last_name: last_name ? last_name.trim() : null,
      email: email.trim().toLowerCase(),
      password,
      role_id,
    });

    const token = generateToken(user);

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userResponse,
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
      // TODO: Add role include when Role model exists
      // include: [{ model: Role, as: "role" }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.is_locked) {
      return res.status(403).json({ message: "Account locked" });
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