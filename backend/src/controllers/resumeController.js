import multer from "multer";
import { PDFExtract } from "pdf.js-extract";
import User from "../models/user.js";
import Resume from "../models/resumeModel.js";
import { analyzeResumeWithGemini } from "../utils/geminiClient.js";

const pdfExtract = new PDFExtract();
const storage = multer.memoryStorage();

export const uploadResumeMiddleware = multer({ storage }).single("resume");

/* =========================================
   POST - Upload & Analyze Resume
   Route: /api/resume/upload
========================================= */
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    console.log("📄 Extracting text from PDF...");

    const data = await pdfExtract.extractBuffer(req.file.buffer, {
      normalizeWhitespace: true,
      combineTextItems: true,
    });

    let text = "";
    data.pages.forEach(page => {
      page.content.forEach(item => {
        text += item.str + " ";
      });
    });

    console.log("✅ Extracted text length:", text.length);

    if (!text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Unable to extract readable text from PDF"
      });
    }

    console.log("🤖 Sending resume to Gemini AI...");
    const aiData = await analyzeResumeWithGemini(text);

    // Archive old pending resumes (optional but professional)
    await Resume.updateMany(
      { userId: req.user._id, status: "pending" },
      { status: "archived" }
    );

    const resume = await Resume.create({
      userId: req.user._id,
      originalText: text.trim(),
      parsedData: aiData,
      status: "pending"
    });

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.resumeUploaded = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Resume analyzed successfully ✅",
      resumeId: resume._id,
      data: aiData
    });

  } catch (error) {
    console.error("🔥 Resume AI Error:", error);
    return res.status(500).json({
      success: false,
      message: "AI Resume analysis failed"
    });
  }
};


/* =========================================
   GET - Get Logged-in User Resume
   Route: /api/resume/my
========================================= */
export const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user._id })
                              .sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found"
      });
    }

    return res.status(200).json({
      success: true,
      resume
    });

  } catch (error) {
    console.error("GET RESUME ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resume"
    });
  }
};


/* =========================================
   PATCH - Confirm Resume
   Route: /api/resume/confirm/:resumeId
========================================= */
export const confirmResume = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findByIdAndUpdate(
      resumeId,
      { status: "confirmed" },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume confirmed successfully ✅",
      resume
    });

  } catch (error) {
    console.error("CONFIRM RESUME ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to confirm resume"
    });
  }
};
