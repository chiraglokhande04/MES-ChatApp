const Admin = require("../models/adminModel"); // or adminModel.js if renamed
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin Registration
const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });
    
    const existingUser = await Admin.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email already in use." });
    
    const newAdmin = new Admin({ name, email, password, role: "admin" });
    
    await newAdmin.save(); // password gets hashed in schema
    
    res.status(201).json({ message: "Admin registered successfully." });
  } catch (error) {
    if (error.status === 403) {
      return res.status(403).json({ message: "Admin already exists." });
    }
    console.error("adminRegister error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// Admin Login - Modified to not store login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required." });
    
    const admin = await Admin.findOne({ email }).select("+password");
    
    if (!admin)
      return res.status(401).json({ message: "Invalid credentials." });
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });
    
    // Create short-lived token that expires quickly
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Short expiration time, forcing re-login
    );
    
    // Don't set any cookies or persistent storage
    
    res.status(200).json({
      message: "Login successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("adminLogin error:", error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

// You might also want to add a middleware to verify the token
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Authentication required. Please login." });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required. Please login." });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      // Token expired or invalid
      return res.status(401).json({ message: "Session expired. Please login again." });
    }
  } catch (error) {
    console.error("verifyToken error:", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = {
  adminLogin,
  adminRegister,
  verifyToken
};