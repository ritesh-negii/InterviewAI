// backend/src/utils/aiHelper.js

import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";

// ========================================
// Generate Interview Question
// ========================================
export async function generateQuestion(context) {
  const { type, difficulty, profile, resume, questionNumber, previousQuestions } = context;

  // ✅ Initialize Gemini Client (matches your geminiClient.js style)
  console.log("DEBUG: Gemini API Key for interview:", process.env.GEMINI_API_KEY ? "Exists" : "Missing");
  
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API Key is missing in environment variables");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  // Build context-aware prompt based on interview type
  let typeSpecificContext = "";
  
  if (type === "technical") {
    typeSpecificContext = `
Focus Areas:
- Data Structures & Algorithms (arrays, trees, graphs, sorting, searching)
- System Design (scalability, databases, caching, load balancing)
- Technical concepts (OOP, design patterns, time/space complexity)
- Problem-solving and coding logic
`;
  } else if (type === "behavioral") {
    typeSpecificContext = `
Focus Areas:
- STAR method questions (Situation, Task, Action, Result)
- Team collaboration and communication
- Conflict resolution and leadership
- Problem-solving in real scenarios
- Time management and prioritization
`;
  } else if (type === "role-specific") {
    typeSpecificContext = `
Focus Areas:
- Technologies from resume: ${resume?.skills?.join(", ") || "General programming"}
- Projects: ${resume?.projects?.map(p => p.name).join(", ") || "None"}
- Role: ${profile?.targetRole || "Software Developer"}
- Practical application of their skills
- Real-world scenarios related to their experience
`;
  }

  const prompt = `
You are an expert technical interviewer conducting a ${type} interview.

Candidate Context:
- Target Role: ${profile?.targetRole || "Software Developer"}
- Experience Level: ${profile?.experience || "Fresher"}
- Skills: ${resume?.skills?.join(", ") || "Not specified"}
- Education: ${profile?.degree || "Not specified"} from ${profile?.college || "Not specified"}

${typeSpecificContext}

Interview Settings:
- Difficulty Level: ${difficulty}
- Question Number: ${questionNumber}

${previousQuestions && previousQuestions.length > 0 ? `
Previously Asked Questions (DO NOT REPEAT):
${previousQuestions.map((q, i) => `${i + 1}. ${q.text}`).join("\n")}
` : ""}

Task:
Generate ONE unique, engaging interview question that:
1. Matches the ${difficulty} difficulty level
2. Is appropriate for ${type} interview
3. Is relevant to ${profile?.targetRole || "Software Developer"} role
4. Considers candidate's ${profile?.experience || "Fresher"} experience level
5. Does NOT repeat any previous questions

Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json or \`\`\`.

Format:
{
  "text": "Your question here?",
  "category": "DSA" | "System Design" | "Behavioral" | "Technical" | "General",
  "difficulty": "easy" | "medium" | "hard"
}

Generate the question now:
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // ✅ Clean response (remove markdown backticks if Gemini adds them)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Parse to actual JSON object
    const parsed = JSON.parse(text);
    
    // Validate response
    if (!parsed.text || !parsed.category) {
      throw new Error("Invalid AI response format");
    }
    
    return {
      id: uuidv4(),
      text: parsed.text,
      category: parsed.category,
      difficulty: parsed.difficulty || difficulty
    };

  } catch (error) {
    console.error("❌ Error generating question:", error.message);
    
    // Fallback questions based on type
    const fallbackQuestions = {
      technical: {
        easy: "What is the difference between let, const, and var in JavaScript?",
        medium: "Explain how you would implement a function to reverse a linked list.",
        hard: "Design a distributed cache system that can handle millions of requests per second."
      },
      behavioral: {
        easy: "Tell me about yourself and your background.",
        medium: "Describe a time when you had to work under pressure to meet a deadline.",
        hard: "Tell me about a time when you had to make a difficult decision that affected your team."
      },
      "role-specific": {
        easy: `What interests you about the ${profile?.targetRole || "Software Developer"} role?`,
        medium: `Describe a project where you used ${resume?.skills?.[0] || "your skills"}.`,
        hard: `How would you architect a scalable ${profile?.targetRole?.toLowerCase() || "web"} application?`
      }
    };
    
    return {
      id: uuidv4(),
      text: fallbackQuestions[type]?.[difficulty] || "Tell me about your experience with software development.",
      category: type === "behavioral" ? "Behavioral" : "Technical",
      difficulty: difficulty
    };
  }
}

// ========================================
// Evaluate Answer (with streaming support)
// ========================================
export async function evaluateAnswer(context) {
  const { question, answer, category, difficulty, onStream } = context;

  // Check if answer is empty or too short
  if (!answer || answer.trim().length < 10) {
    return {
      score: 1,
      feedback: "The answer provided was too brief. Please provide more detailed responses.",
      strengths: [],
      improvements: ["Provide more detailed explanations", "Include specific examples", "Elaborate on your thought process"]
    };
  }

  // ✅ Initialize Gemini Client (matches your geminiClient.js style)
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API Key is missing in environment variables");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const prompt = `
You are an expert interviewer evaluating a candidate's answer.

Question Details:
- Question: ${question}
- Category: ${category}
- Difficulty: ${difficulty}

Candidate's Answer:
"${answer}"

Your Task:
Evaluate this answer thoroughly and provide:
1. Score (1-10) - Be fair but critical
   - 1-3: Poor answer, major gaps
   - 4-6: Average, needs improvement
   - 7-8: Good answer, minor improvements needed
   - 9-10: Excellent, comprehensive answer

2. Detailed Feedback (2-4 sentences)
   - What was good about the answer
   - What could be improved
   - Overall impression

3. Strengths (2-3 specific points)
   - What they did well
   - Strong points in their answer

4. Areas for Improvement (2-3 specific suggestions)
   - What they missed
   - How to improve
   - Additional points to consider

Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json or \`\`\`.

Format:
{
  "score": 8,
  "feedback": "Your detailed 2-4 sentence feedback here...",
  "strengths": ["Specific strength 1", "Specific strength 2", "Specific strength 3"],
  "improvements": ["Specific improvement 1", "Specific improvement 2", "Specific improvement 3"]
}

Evaluate the answer now:
`;

  try {
    // If streaming callback provided, use streaming
    if (onStream && typeof onStream === "function") {
      const result = await model.generateContentStream(prompt);
      let fullText = "";
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        onStream(chunkText); // Send each chunk to frontend
      }
      
      // ✅ Clean response (remove markdown backticks)
      const cleaned = fullText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);
      
      // Validate and sanitize
      return {
        score: Math.min(10, Math.max(0, parsed.score || 5)),
        feedback: parsed.feedback || "Answer evaluated.",
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3) : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 3) : []
      };
      
    } else {
      // Non-streaming evaluation
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // ✅ Clean response (remove markdown backticks)
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(text);
      
      return {
        score: Math.min(10, Math.max(0, parsed.score || 5)),
        feedback: parsed.feedback || "Answer evaluated.",
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3) : [],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 3) : []
      };
    }

  } catch (error) {
    console.error("❌ Error evaluating answer:", error.message);
    
    // Fallback evaluation
    return {
      score: 5,
      feedback: "Your answer shows understanding of the topic. Consider providing more specific examples and details to strengthen your response.",
      strengths: ["Attempted to answer the question", "Shows basic understanding"],
      improvements: ["Provide more specific examples", "Elaborate on key concepts", "Structure your answer more clearly"]
    };
  }
}

// ========================================
// Generate Final Report
// ========================================
export async function generateFinalReport(session) {
  const answeredQuestions = session.questions.filter(q => q.answer && q.answer !== "[SKIPPED]");
  
  if (answeredQuestions.length === 0) {
    return {
      strengths: ["Completed the interview session"],
      weaknesses: ["No questions were answered"],
      recommendations: ["Try answering questions next time", "Practice interview skills"]
    };
  }

  // Calculate statistics
  const avgScore = answeredQuestions.reduce((sum, q) => sum + (q.evaluation?.score || 0), 0) / answeredQuestions.length;
  const categoryBreakdown = {};
  
  answeredQuestions.forEach(q => {
    if (!categoryBreakdown[q.category]) {
      categoryBreakdown[q.category] = { total: 0, count: 0 };
    }
    categoryBreakdown[q.category].total += q.evaluation?.score || 0;
    categoryBreakdown[q.category].count += 1;
  });

  // Identify strengths and weaknesses
  const strengths = [];
  const weaknesses = [];
  
  Object.keys(categoryBreakdown).forEach(cat => {
    const avgCatScore = categoryBreakdown[cat].total / categoryBreakdown[cat].count;
    if (avgCatScore >= 7) {
      strengths.push(`Strong performance in ${cat} questions`);
    } else if (avgCatScore < 5) {
      weaknesses.push(`Need improvement in ${cat} questions`);
    }
  });

  // General recommendations
  const recommendations = [
    avgScore < 6 ? "Focus on strengthening fundamental concepts" : "Continue practicing to maintain your skills",
    "Review questions you found challenging",
    "Practice more mock interviews to build confidence"
  ];

  return {
    strengths: strengths.length > 0 ? strengths : ["Completed the interview", "Showed effort in answering questions"],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Keep practicing to improve further"],
    recommendations: recommendations.filter(Boolean)
  };
}

// ========================================
// Generate Final Report
// ========================================
export async function generateFinalReport(session) {
  const answeredQuestions = session.questions.filter(q => q.answer && q.answer !== "[SKIPPED]");
  
  if (answeredQuestions.length === 0) {
    return {
      strengths: ["Completed the interview session"],
      weaknesses: ["No questions were answered"],
      recommendations: ["Try answering questions next time", "Practice interview skills"]
    };
  }

  // Calculate statistics
  const avgScore = answeredQuestions.reduce((sum, q) => sum + (q.evaluation?.score || 0), 0) / answeredQuestions.length;
  const categoryBreakdown = {};
  
  answeredQuestions.forEach(q => {
    if (!categoryBreakdown[q.category]) {
      categoryBreakdown[q.category] = { total: 0, count: 0 };
    }
    categoryBreakdown[q.category].total += q.evaluation?.score || 0;
    categoryBreakdown[q.category].count += 1;
  });

  // Identify strengths and weaknesses
  const strengths = [];
  const weaknesses = [];
  
  Object.keys(categoryBreakdown).forEach(cat => {
    const avgCatScore = categoryBreakdown[cat].total / categoryBreakdown[cat].count;
    if (avgCatScore >= 7) {
      strengths.push(`Strong performance in ${cat} questions`);
    } else if (avgCatScore < 5) {
      weaknesses.push(`Need improvement in ${cat} questions`);
    }
  });

  // General recommendations
  const recommendations = [
    avgScore < 6 ? "Focus on strengthening fundamental concepts" : "Continue practicing to maintain your skills",
    "Review questions you found challenging",
    "Practice more mock interviews to build confidence"
  ];

  return {
    strengths: strengths.length > 0 ? strengths : ["Completed the interview", "Showed effort in answering questions"],
    weaknesses: weaknesses.length > 0 ? weaknesses : ["Keep practicing to improve further"],
    recommendations: recommendations.filter(Boolean)
  };
}