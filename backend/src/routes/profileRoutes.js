import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { updateProfile } from "../controllers/profileController.js";

const router = express.Router();

// PUT → update profile settings
router.put("/update", authMiddleware, updateProfile);

export default router;
