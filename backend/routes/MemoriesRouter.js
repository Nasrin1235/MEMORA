import express from 'express';
import { Memories} from '../models/travelStory.js';
import { isAuthenticated } from '../middleware/auth.js'; 
import upload from '../middleware/multer.js';
import fs from 'fs';
import path from 'path';

 const memoriesRouter = express.Router();

// Create a new memories story
memoriesRouter.post('/add-memories', isAuthenticated, async (req, res) => {
  try {
    const { title, story, visitedLocation, isFavourite, imageUrl, visitedDate } = req.body;

    // Validate required fields
    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const memories = new Memories({
      title,
      story,
      visitedLocation,
      isFavourite,
      userId: req.user.id, // Using authenticated user's ID
      imageUrl,
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

// Get all memories stories of the authenticated user
memoriesRouter.get('/get', isAuthenticated, async (req, res) => {
    try {
      const memories = await Memories.find({ userId: req.user.id });
      res.status(200).json(memories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch memories stories" });
    }
  });

// Upload image
memoriesRouter.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded" }); // File check
  }

  try {
    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: `http://localhost:3001/uploads/${req.file.filename}`, // Link to the uploaded image
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete image
memoriesRouter.delete("/delete-image", (req, res) => {
  const { imageUrl } = req.body; // Assuming imageUrl is sent in the request body

  if (!imageUrl) {
    return res.status(400).json({ error: "Image URL is required" });
  }

  // Extract file name from URL
  const fileName = path.basename(imageUrl);

  // Create file path
  const filePath = path.join(process.cwd(), 'uploads', fileName);

  // Check if the file exists
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: "Failed to delete the image" });
    }
    res.status(200).json({ message: "Image deleted successfully" });
  });
});

// Get a specific memories story by ID
memoriesRouter.get('/:id', isAuthenticated, async (req, res) => {
    console.log('GET request received'); 
    console.log('User ID:', req.user.id); 
  try {
    const memories = await Memories.findById(req.params.id);
    console.log('Fetched memories Stories:', memories); 
    if (!memories) {
      return res.status(404).json({ error: "memories story not found" });
    }
    res.status(200).json(memories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch memories story" });
  }
});

// Update a specific memories story by ID
memoriesRouter.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const { title, story, visitedLocation, isFavourite, imageUrl, visitedDate } = req.body;

    // Convert visitedDate from milliseconds to Date object
    const formattedVisitedDate = visitedDate ? new Date(visitedDate) : null;

    // Find the memories story by ID
    const memories = await Memories.findById(req.params.id);

    if (!memories) {
      return res.status(404).json({ error: "memories story not found" });
    }

    // Ensure that the memories story belongs to the authenticated user
    if (memories.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to edit this story" });
    }

    // Use a placeholder image if no new image is provided
    const finalImageUrl = imageUrl || `http://localhost:3001/`; // Placeholder image URL

    // Update the memories story
    memories.title = title || memories.title;
    memories.story = story || memories.story;
    memories.visitedLocation = visitedLocation || memories.visitedLocation;
    memories.isFavourite = isFavourite !== undefined ? isFavourite : memories.isFavourite;
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
memoriesRouter.get('/search', isAuthenticated, async (req, res) => {
  const { title, story } = req.query;

  try {
    const query = {};

    // Validation for title and story
    if (title) {
      query.title = { $regex: title, $options: 'i' }; // case-insensitive search
    }

    if (story) {
      query.story = { $regex: story, $options: 'i' }; // case-insensitive search
    }

    // Search in the database
    const memories = await Memories.find(query)
      .populate('userId', 'username') // Optional: Populate userId field to get username
      .exec();

    if (!memories.length) {
      return res.status(404).json({ error: "No memories stories found" });
    }

    res.status(200).json({ memories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search memories stories' });
  }
});



memoriesRouter.delete('/delete/:id', isAuthenticated, async (req, res) => {
  try {
    const deletedMemories = await  Memories.findByIdAndDelete(req.params.id);
    if (!deletedMemories) {
      return res.status(404).json({ error: "memories story not found" });
    }

    res.status(200).json({ message: "memories story deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete memories story" });
  }
});


export default memoriesRouter;