import express from "express";
import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isAuthenticated } from "../middleware/auth.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const userRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/avatars/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const uploadAvatar = multer({ storage: avatarStorage });
// Registriere einen neuen Benutzer
userRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password, imageUrl } = req.body;

    // Если imageUrl не передан, устанавливаем случайный аватар
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

    // Создаем пользователя
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

// Benutzer anmelden
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
      {
        expiresIn: "1h",
      }
    );
    // Speichere das Token im Cookie
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

// Token validieren
userRouter.get("/validate-token", isAuthenticated, (req, res) => {
  if (!req.user || !req.user.username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.status(200).json({ username: req.user.username, isLoggedIn: true });
});

userRouter.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl || "default-avatar.png",
      backgroundImage: user.backgroundImage || "",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});
const backgroundStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/backgrounds/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const uploadBackground = multer({ storage: backgroundStorage });

userRouter.post(
  "/upload-background",
  isAuthenticated,
  uploadBackground.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No background image uploaded" });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      user.backgroundImage = `/uploads/backgrounds/${req.file.filename}`;
      await user.save();

      res.status(200).json({
        message: "Background uploaded successfully",
        backgroundImage: user.backgroundImage,
      });
    } catch (error) {
      console.error("Error uploading background:", error);
      res.status(500).json({ error: "Failed to upload background" });
    }
  }
);
userRouter.delete("/delete-background", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (
      user.backgroundImage &&
      user.backgroundImage.includes("/uploads/backgrounds/")
    ) {
      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "backgrounds",
        path.basename(user.backgroundImage)
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn("File not found:", filePath);
      }
    }
    user.backgroundImage = "";
    await user.save();

    res.status(200).json({ message: "Background removed successfully" });
  } catch (error) {
    console.error("Error deleting background:", error);
    res.status(500).json({ error: "Failed to delete background" });
  }
});

userRouter.post(
  "/upload-image",
  isAuthenticated,
  uploadAvatar.single("image"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      user.imageUrl = `/uploads/avatars/${req.file.filename}`;
      await user.save();

      res.status(200).json({
        message: "Avatar uploaded successfully",
        imageUrl: user.imageUrl,
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      res.status(500).json({ error: error.message });
    }
  }
);
userRouter.put("/update", isAuthenticated, async (req, res) => {
  try {
    const { username, email, imageUrl } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    if (typeof imageUrl === "string" && imageUrl.trim() !== "") {
      user.imageUrl = imageUrl;
    } else {
      console.warn("Invalid imageUrl received:", imageUrl);
    }

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
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});
userRouter.delete("/delete-account", isAuthenticated, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.cookie("token", "", { expires: new Date(0) });
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Failed to delete account" });
  }
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
