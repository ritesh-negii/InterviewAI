import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadResumeMiddleware, uploadResume } from "../controllers/resumeController.js";

const router = express.Router();

// POST /api/resume/upload
router.post("/upload", authMiddleware, uploadResumeMiddleware, uploadResume);

export default router;
