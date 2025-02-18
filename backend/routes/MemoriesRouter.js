import express from "express";
import { Memories } from "../models/memories.js";
import { isAuthenticated } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

const memoriesRouter = express.Router();

// Upload image
memoriesRouter.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded" });
  }

  try {
    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: `/uploads/${req.file.filename}`, // Link to the uploaded image
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new memories story
memoriesRouter.post("/add-memories", isAuthenticated, async (req, res) => {
  try {
    const {
      title,
      memorie,
      cityName, 
      visitedLocation,
      isFavorite,
      imageUrl,
      visitedDate,
    } = req.body;

    // Validate required fields
    if (!title || !memorie || !visitedLocation || !visitedDate || !cityName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const memories = new Memories({
      title,
      memorie,
      cityName,
      visitedLocation,
      isFavorite: isFavorite || false,
      userId: req.user.id,
      imageUrl: imageUrl || "", 
      visitedDate,
    });

    await memories.save();

    res.status(201).json({
      message: "memories story created successfully",
      memories,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

memoriesRouter.get("/get", isAuthenticated, async (req, res) => {
  try {
    const memories = await Memories.find({ userId: req.user.id });
    console.log("Sending memories from API:", memories);
    res.status(200).json(memories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch memories stories" });
  }
});


// Delete image
memoriesRouter.delete("/delete-image", (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  // Extract file name from URL
  const fileName = path.basename(imageUrl);

  // Create file path
  const filePath = path.join(process.cwd(), "uploads", fileName);

  // Check if the file exists
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete the image" });
    }
    res.status(200).json({ message: "Image deleted successfully" });
  });
});

// Get a specific memories story by ID
memoriesRouter.get("/:id", isAuthenticated, async (req, res) => {
  console.log("GET request received");
  console.log("User ID:", req.user.id);

  let memoryId = req.params.id.trim();

  if (!mongoose.Types.ObjectId.isValid(memoryId)) {
    return res.status(400).json({ error: "Invalid memory ID" });
  }

  try {
    const memories = await Memories.findById(memoryId);
    console.log("Fetched memories Stories:", memories);

    if (!memories) {
      return res.status(404).json({ error: "Memories story not found" });
    }

    res.status(200).json(memories);
  } catch (error) {
    console.error("Database error:", error);
    res
      .status(500)
      .json({
        error: "Failed to fetch memories story",
        details: error.message,
      });
  }
});

// Update a specific memories story by ID
memoriesRouter.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const {
      title,
      memorie,
      visitedLocation,
      cityName, 
      isFavorite,
      imageUrl,
      visitedDate,
    } = req.body;

    // Convert visitedDate from milliseconds to Date object
    const formattedVisitedDate = visitedDate ? new Date(visitedDate) : null;

    // Clean up the memory ID by trimming any extra spaces or newline characters
    const memoryId = req.params.id.trim();

    // Validate that the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(memoryId)) {
      return res
        .status(400)
        .json({ error: "Invalid memory ID" });
    }

    // Find the memories story by ID
    const memories = await Memories.findById(memoryId);

    if (!memories) {
      return res.status(404).json({ error: "memories story not found" });
    }

    // Ensure that the memories story belongs to the authenticated user
    if (memories.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to edit this story" });
    }

    // Use a placeholder image if no new image is provided
    const finalImageUrl = imageUrl || `http://localhost:3001/`;

    
    memories.title = title || memories.title;
    memories.memorie = memorie || memories.memorie;
    memories.cityName = cityName || memories.cityName; 
    memories.visitedLocation = visitedLocation || memories.visitedLocation;
    memories.isFavorite =
      isFavorite !== undefined ? isFavorite : memories.isFavorite;
    memories.imageUrl = finalImageUrl;
    memories.visitedDate = formattedVisitedDate || memories.visitedDate;

    await memories.save();

    res.status(200).json({
      message: "memories story updated successfully",
      updatedMemories: memories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update memories story" });
  }
});


// Search memories stories based on title or story content
memoriesRouter.post("/search", isAuthenticated, async (req, res) => {
  const { title, story } = req.body;

  try {
    const query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (story) {
      query.memorie = { $regex: story, $options: "i" };
    }

    const memories = await Memories.find(query)
      .populate("userId", "username")
      .exec();

    if (!memories.length) {
      return res.status(404).json({ error: "No memories stories found" });
    }

    res.status(200).json({ memories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to search memories stories" });
  }
});

memoriesRouter.delete("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const deletedMemories = await Memories.findByIdAndDelete(req.params.id);
    if (!deletedMemories) {
      return res.status(404).json({ error: "memories story not found" });
    }

    res.status(200).json({ message: "memories story deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete memories story" });
  }
});

export default memoriesRouter;
