// backend/src/models/InterviewSession.js

import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["DSA", "System Design", "Behavioral", "Technical", "General"],
    default: "General"
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium"
  },
  answer: {
    type: String,
    default: ""
  },
  evaluation: {
    score: { 
      type: Number, 
      min: 0, 
      max: 10,
      default: 0
    },
    feedback: {
      type: String,
      default: ""
    },
    strengths: {
      type: [String],
      default: []
    },
    improvements: {
      type: [String],
      default: []
    }
  },
  timeSpent: {
    type: Number, // seconds
    default: 0
  },
  answeredAt: {
    type: Date
  }
});

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    socketId: {
      type: String
    },
    type: {
      type: String,
      enum: ["technical", "behavioral", "role-specific"], // ✅ Only 3 types
      required: true
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true
    },
    duration: {
      type: String,
      enum: ["quick", "standard", "full"],
      default: "standard"
    },
    status: {
      type: String,
      enum: ["in-progress", "paused", "completed", "abandoned"],
      default: "in-progress",
      index: true
    },
    currentQuestionIndex: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      default: 10
    },
    questions: [questionSchema],
    overallScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    finalReport: {
      strengths: {
        type: [String],
        default: []
      },
      weaknesses: {
        type: [String],
        default: []
      },
      recommendations: {
        type: [String],
        default: []
      },
      categoryScores: {
        dsa: { type: Number, default: 0 },
        systemDesign: { type: Number, default: 0 },
        behavioral: { type: Number, default: 0 },
        technical: { type: Number, default: 0 }
      }
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date
    },
    totalTimeSpent: {
      type: Number, // Total seconds spent
      default: 0
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
interviewSessionSchema.index({ userId: 1, createdAt: -1 });
interviewSessionSchema.index({ status: 1, userId: 1 });

// Virtual for duration in minutes
interviewSessionSchema.virtual("durationMinutes").get(function() {
  return Math.round(this.totalTimeSpent / 60);
});

// Method to calculate overall score
interviewSessionSchema.methods.calculateOverallScore = function() {
  const answeredQuestions = this.questions.filter(q => q.evaluation && q.evaluation.score > 0);
  
  if (answeredQuestions.length === 0) {
    this.overallScore = 0;
    return 0;
  }

  const totalScore = answeredQuestions.reduce((sum, q) => sum + q.evaluation.score, 0);
  const avgScore = totalScore / answeredQuestions.length;
  this.overallScore = Math.round(avgScore * 10); // Convert to 0-100 scale
  
  return this.overallScore;
};

// Method to get category breakdown
interviewSessionSchema.methods.getCategoryBreakdown = function() {
  const categories = {};
  
  this.questions.forEach(q => {
    if (!q.evaluation || !q.evaluation.score) return;
    
    const cat = q.category;
    if (!categories[cat]) {
      categories[cat] = { total: 0, count: 0 };
    }
    
    categories[cat].total += q.evaluation.score;
    categories[cat].count += 1;
  });

  const breakdown = {};
  Object.keys(categories).forEach(cat => {
    breakdown[cat] = Math.round((categories[cat].total / categories[cat].count) * 10);
  });

  return breakdown;
};

export default mongoose.model("InterviewSession", interviewSessionSchema);