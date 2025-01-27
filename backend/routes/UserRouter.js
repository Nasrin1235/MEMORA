import express from "express";
import { User } from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "../middleware/auth.js";

const userRouter = express.Router();

// Registriere einen neuen Benutzer
userRouter.post("/register", async (req, res) => {
  try {
    console.log("Received request data:", req.body);
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

// Benutzer anmelden
userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    // Speichere das Token im Cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      expires: new Date(Date.now() + 5 * 60 * 1000),
    });

    res.status(200).json({
      message: "Login successful",
      token,
      username: user.username,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
});

// Token validieren
userRouter.get("/validate-token", isAuthenticated, (req, res) => {
  res.status(200).json({ message: "Token is valid", payload: req.user });
});

// Benutzer abmelden
userRouter.post("/logout", async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    res.cookie("token", "", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      expires: new Date(0),
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: error.message });
  }
});

export default userRouter;
