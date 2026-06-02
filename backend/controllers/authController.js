const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secretKey = process.env.JWT_SECRET;

// User Registration
const registerUser = async (req, res) => {
  try {
    const { name , email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash using the salt

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    // Create a token and return user details so the frontend can auto-login
    const token = jwt.sign({ id: newUser._id }, secretKey, { expiresIn: "1h" });
    res.status(201).json({ authtoken: token, user: { id: newUser._id, name: newUser.name, email: newUser.email } });
  } catch (error) {
    console.error(error); // <-- This will print the real error in the terminal
    res.status(500).json({ message: error.message }); // <-- Send real error message
  }
};

// login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: "1h" });

    res.json({ authtoken: token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };

