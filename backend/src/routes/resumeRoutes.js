import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  uploadResumeMiddleware,
  uploadResume,
  confirmResume,
  getMyResume,
  updateResume
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
// Get Logged-in User Resume
// GET /api/resume/my
// ===============================
router.get(
  "/my",
  authMiddleware,
  getMyResume
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
// ✅ Update Resume Details
// PATCH /api/resume/:resumeId (Changed from PUT /update)
// ===============================
router.patch(
  "/:resumeId",
  authMiddleware,
  updateResume
);

export default router;

