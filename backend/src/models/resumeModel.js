import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  originalText: {
    type: String,
    required: true
  },

  parsedData: {
    skills: [String],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String]
      }
    ],
    experience: [
      {
        role: String,
        company: String,
        duration: String,
        description: String
      }
    ],
    education: [
      {
        degree: String,
        institution: String,
        year: String
      }
    ]
  },

  status: {
    type: String,
    enum: ["pending", "confirmed"],
    default: "pending"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Resume", resumeSchema);
