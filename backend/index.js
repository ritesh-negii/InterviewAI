// backend/index.js (or server.js)

import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import resumeRoutes from "./src/routes/resumeRoutes.js";

const app = express();
const server = http.createServer(app);

// 🔥 SOCKET.IO SETUP
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"]
  },
});

// ✅ WebSocket Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    console.log("❌ No token provided for socket connection");
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id; // Attach user ID to socket
    console.log("✅ Socket authenticated for user:", decoded.id);
    next();
  } catch (error) {
    console.log("❌ Invalid token for socket connection");
    return next(new Error("Authentication error: Invalid token"));
  }
});

// ✅ WebSocket Connection Handler
io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id, "| User ID:", socket.userId);

  // Import interview handlers
  import("./src/sockets/interviewHandlers.js").then((module) => {
    module.default(io, socket);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });

  // Error handler
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// Make io accessible to routes (optional)
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
      profile: "/api/profile",
      resume: "/api/resume",
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

// ❌ ERROR HANDLING
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
  console.log(`🔌 WebSocket server ready`);
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

// Export io for use in other files if needed
export { io };