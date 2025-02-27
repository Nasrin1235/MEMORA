import express from "express";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password, imageUrl } = req.body;

    const defaultAvatars = [
      "https://api.dicebear.com/7.x/avataaars/svg?seed=random1",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=random2",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=random3",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=random4",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=random5",
    ];
    const randomAvatar =
      imageUrl ||
      defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];

    const user = await User.create({
      username,
      email,
      password,
      imageUrl: randomAvatar,
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,

      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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

userRouter.get("/validate-token", isAuthenticated, (req, res) => {
  if (!req.user || !req.user.username) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.status(200).json({ username: req.user.username, isLoggedIn: true });
});

userRouter.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    res.status(200).json({
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl
        ? `${user.imageUrl}?t=${Date.now()}`
        : "default-avatar.png",
      backgroundImage: user.backgroundImage
        ? `${user.backgroundImage}?t=${Date.now()}`
        : "",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

userRouter.post(
  "/upload-avatar",
  isAuthenticated,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      user.imageUrl = req.file.path; // URL Cloudinary
      await user.save();

      res.status(200).json({
        message: "Avatar uploaded successfully",
        imageUrl: user.imageUrl,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload avatar" });
    }
  }
);

userRouter.post(
  "/upload-background",
  isAuthenticated,
  upload.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      user.backgroundImage = req.file.path; // URL Cloudinary
      await user.save();

      res.status(200).json({
        message: "Background uploaded successfully",
        backgroundImage: user.backgroundImage,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to upload background" });
    }
  }
);

userRouter.delete("/delete-background", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.backgroundImage = "";
    await user.save();

    res.status(200).json({ message: "Background removed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete background" });
  }
});

userRouter.put("/update", isAuthenticated, async (req, res) => {
  try {
    const { username, email, imageUrl } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;
    if (imageUrl !== undefined) user.imageUrl = imageUrl;
    await user.save();
    res.status(200).json({
      message: "User profile updated successfully",
      user: {
        username: user.username,
        email: user.email,
        imageUrl: user.imageUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user profile" });
  }
});
userRouter.delete("/delete-account", isAuthenticated, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.cookie("token", "", { expires: new Date(0) });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete account" });
  }
});

userRouter.post("/logout", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    res.cookie("token", "", {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      expires: new Date(0),
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default userRouter;
