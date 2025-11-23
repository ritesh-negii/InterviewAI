import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  uploadResumeMiddleware,
  uploadResume,
 confirmResume,
  getMyResume
} from "../controllers/resumeController.js";

const router = express.Router();

// ===============================
// Upload & Analyze Resume
// POST /api/resume/upload
// ===============================
router.post(
  "/upload",
  authMiddleware,
  uploadResumeMiddleware,
  uploadResume
);

// ===============================
// Confirm Resume (after UI review)
// PATCH /api/resume/confirm/:resumeId
// ===============================
router.patch(
  "/confirm/:resumeId",
  authMiddleware,
  confirmResume
);

// ===============================
// Get Logged-in User Resume
// GET /api/resume/my
// ===============================
router.get(
  "/my",
  authMiddleware,
  getMyResume
);

export default router;

