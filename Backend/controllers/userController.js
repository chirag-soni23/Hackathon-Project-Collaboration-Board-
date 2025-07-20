import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import { TryCatch } from "../utils/TryCatch.js";
import { generateToken } from "../utils/generateToken.js";

// Register
export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "Already have an account" });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  // Generate token and set cookie
  generateToken(user._id, res);

  // Also return token for Streamlit
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.status(200).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token, // ✅ send token in JSON
    message: "User registered successfully!",
  });
});

// Login
export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Email or Password is incorrect" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Email or Password is incorrect" });
  }

  // Set cookie for browser
  generateToken(user._id, res);

  // Return token for Streamlit
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.status(200).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token, // ✅ send token in response
    message: "User Logged in successfully!",
  });
});

// my profile
export const Myprofile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
});

// user profile
export const userProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
});

// logout
export const logout = TryCatch(async (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.json({
    message: "Logged out successfully!",
  });
});
