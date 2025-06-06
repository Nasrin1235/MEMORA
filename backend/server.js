import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dbConnection } from "./script/dbConnection.js";
import cors from "cors";
import userRouter from "./routes/UserRouter.js";
import memoriesRouter from "./routes/MemoriesRouter.js";
import cookieParser from "cookie-parser";


const app = express();
const PORT = 3001;


// Setup middlewares
app.use(cookieParser());
app.use(express.json());

// Connect to database
await dbConnection();

// Routes
app.use("/api", userRouter);
app.use("/api/memory", memoriesRouter);
app.use("/uploads", express.static("uploads"));
app.use("/uploads/avatars", express.static("uploads/avatars"));
app.use("/uploads/backgrounds", express.static("uploads/backgrounds"));

// Fallback for frontend routing
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendDistPath, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
