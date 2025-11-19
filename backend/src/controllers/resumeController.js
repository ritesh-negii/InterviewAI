// src/controllers/resumeController.js

import multer from "multer";
import { PDFExtract } from "pdf.js-extract";
import User from "../models/user.js";

const pdfExtract = new PDFExtract();

// =============================
// 📌 MULTER SETUP
// =============================
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

export const uploadResumeMiddleware = upload.single("resume");

// =============================
// 📌 PROCESS PDF + SAVE IN DB
// =============================
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log("📄 Processing PDF...");

    // Extract text from PDF buffer
    const data = await pdfExtract.extractBuffer(req.file.buffer, {
      normalizeWhitespace: true,
      combineTextItems: true,
    });

    // Combine all text from all pages
    let text = "";
    data.pages.forEach((page) => {
      page.content.forEach((item) => {
        text += item.str + " ";
      });
    });

    console.log("✅ PDF parsed, text length:", text.length);

    // Find user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Save extracted text
    user.resumeText = text.trim();
    user.resumeUploaded = true;
    await user.save();

    console.log("✅ Resume saved to database");

    // 🔴 DAY 3-4: Replace this with real AI parsing (OpenAI)
    // For now, send fake data
    const parsedData = {
      skills: extractSkills(text), // Simple keyword extraction
      projects: [
        { name: "Project A", technologies: ["React", "Node.js"] },
        { name: "Project B", technologies: ["MongoDB", "Express"] },
      ],
      education: [
        { degree: "B.Tech CSE", institution: "XYZ University", year: "2024" },
      ],
    };

    return res.status(200).json({
      success: true,
      message: "Resume uploaded & analyzed successfully! 🎉",
      data: parsedData,
    });
  } catch (error) {
    console.error("🔥 Resume Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process resume",
      error:
        process.env.NODE_ENV === "development" ? error.message : "Server error",
    });
  }
};

// =============================
// 📌 SIMPLE SKILL EXTRACTION (Basic keyword matching)
// =============================
function extractSkills(text) {
  const commonSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "SQL",
    "Python",
    "Java",
    "C++",
    "HTML",
    "CSS",
    "TailwindCSS",
    "Git",
    "Docker",
    "AWS",
    "REST API",
    "GraphQL",
    "Redux",
    "Next.js",
    "Vue.js",
    "Angular",
    "Spring Boot",
  ];

  const foundSkills = commonSkills.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase())
  );

  return foundSkills.length > 0
    ? foundSkills
    : ["JavaScript", "React", "Node.js"];
}
