import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dbConnection } from "./script/dbConnection.js";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import memoriesRouter from "./routes/travelStoryRoutes.js"
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3001;

// Setup middlewares
app.use(cookieParser());
app.use(express.json());

// Setup CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5174"],
    credentials: true,
  })
);

// Static file serving
const _fileName = fileURLToPath(import.meta.url);
const _path = path.dirname(_fileName);
const frontendDistPath = path.join(_path, "../frontend/dist");

app.use(express.static(frontendDistPath));

// Connect to database
await dbConnection();

// Routes
app.use("/api", userRouter);
app.use("/api/memory", memoriesRouter);
app.use("/uploads", express.static("uploads"));


// Fallback for frontend routing
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});