
import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import resumeRoutes from "./src/routes/resumeRoutes.js";




const app = express();
const server = http.createServer(app);

// 🔥 SOCKET.IO SETUP (for real-time interviews - Day 5+)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"]
  },
});

io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Make io accessible to routes (optional, for Day 5+)
app.set("io", io);

// ⚙️ MIDDLEWARE
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📊 CONNECT TO DATABASE
connectDB();

// 🔗 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);


app.use("/api/resume", resumeRoutes);


// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🎯 InterviewAI Backend Running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      health: "/api/health"
    }
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString()
  });
});

// ❌ ERROR HANDLING (Must be AFTER all routes)
// 404 handler

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});
// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { 
      error: err.message,
      stack: err.stack 
    })
  });
});

// 🚀 START SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});