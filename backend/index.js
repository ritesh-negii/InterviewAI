import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// connect MongoDB
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("Hello InterviewAI Backend!");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
