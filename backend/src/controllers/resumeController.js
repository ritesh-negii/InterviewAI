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

    // ✅ Get user profile data to merge with AI extracted data
    const user = await User.findById(req.user._id);
    
    // ✅ Merge profile college data if AI didn't extract valid education
    const hasValidEducation = aiData.education?.some(edu => {
      const lower = edu.institution?.toLowerCase() || '';
      return lower && !['abc', 'xyz', 'example'].some(p => lower.includes(p));
    });

    // If no valid education from AI and user has profile college, add it
    if (!hasValidEducation && user.profile?.college) {
      aiData.education = [{
        degree: user.profile.degree || "Pursuing Degree",
        institution: user.profile.college,
        year: user.profile.year || "Not specified"
      }];
    }
    
    // Also add target role and experience to the data if not present
    if (!aiData.targetRole && user.profile?.targetRole) {
      aiData.targetRole = user.profile.targetRole;
    }
    if (!aiData.experienceLevel && user.profile?.experience) {
      aiData.experienceLevel = user.profile.experience;
    }

    // ✅ FIXED: Update existing resume or create new one (prevents duplicates)
    const resume = await Resume.findOneAndUpdate(
      { userId: req.user._id }, // Find by userId
      {
        originalText: text.trim(),
        parsedData: aiData,
        status: "pending",
        updatedAt: new Date()
      },
      {
        new: true, // Return the updated document
        upsert: true, // Create if doesn't exist
        runValidators: true
      }
    );

    // Update user's resumeUploaded status (already have user from above)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.resumeUploaded = true;
    await user.save();

    console.log("✅ Resume saved/updated successfully");

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
      message: error.message || "AI Resume analysis failed"
    });
  }
};


/* =========================================
   GET - Get Logged-in User Resume
   Route: /api/resume/my
========================================= */
export const getMyResume = async (req, res) => {
  try {
    // ✅ FIXED: No need to sort, since we only have one resume per user now
    const resume = await Resume.findOne({ 
      userId: req.user._id,
      status: { $in: ["pending", "confirmed"] } // Don't fetch archived
    });

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

    // ✅ FIXED: Verify the resume belongs to the logged-in user
    const resume = await Resume.findOneAndUpdate(
      { 
        _id: resumeId,
        userId: req.user._id // Security: ensure user owns this resume
      },
      { 
        status: "confirmed",
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found or access denied"
      });
    }

    console.log("✅ Resume confirmed:", resumeId);

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


/* =========================================
   DELETE - Delete Resume (Optional)
   Route: /api/resume/delete
========================================= */
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ 
      userId: req.user._id 
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found to delete"
      });
    }

    // Update user's resumeUploaded status
    await User.findByIdAndUpdate(req.user._id, { 
      resumeUploaded: false 
    });

    console.log("✅ Resume deleted for user:", req.user._id);

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully"
    });

  } catch (error) {
    console.error("DELETE RESUME ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete resume"
    });
  }
};