// backend/src/sockets/interviewHandlers.js

import InterviewSession from "../models/InterviewSession.js";
import User from "../models/user.js";
import Resume from "../models/resumeModel.js";
import { generateQuestion, evaluateAnswer, generateFinalReport } from "../utils/aiHelper.js";

// ✅ Changed to default export function (not arrow function in export)
export default function interviewHandlers(io, socket) {
  
  // ========================================
  // Event: Start Interview
  // ========================================
  socket.on("start_interview", async (data) => {
    try {
      const { type, difficulty, duration } = data;
      const userId = socket.userId;

      console.log(`🎯 Starting ${type} interview for user:`, userId);

      // Validate input
      if (!["technical", "behavioral", "role-specific"].includes(type)) {
        return socket.emit("error", { message: "Invalid interview type" });
      }

      if (!["easy", "medium", "hard"].includes(difficulty)) {
        return socket.emit("error", { message: "Invalid difficulty level" });
      }

      // 1. Fetch user context
      const user = await User.findById(userId);
      const resume = await Resume.findOne({ userId });

      if (!user) {
        return socket.emit("error", { 
          message: "User not found. Please log in again." 
        });
      }

      if (!resume && type === "role-specific") {
        return socket.emit("error", { 
          message: "Resume not found. Please upload your resume first." 
        });
      }

      // 2. Determine total questions based on duration
      const questionCounts = { 
        quick: 5, 
        standard: 10, 
        full: 15 
      };
      const totalQuestions = questionCounts[duration] || 10;

      // 3. Generate first question
      console.log("🤖 Generating first question...");
      
      const firstQuestion = await generateQuestion({
        type,
        difficulty,
        profile: user.profile || {},
        resume: resume?.parsedData || {},
        questionNumber: 1,
        previousQuestions: []
      });

      console.log("✅ First question generated:", firstQuestion.text);

      // 4. Create interview session
      const session = await InterviewSession.create({
        userId,
        socketId: socket.id,
        type,
        difficulty,
        duration,
        totalQuestions,
        questions: [
          {
            questionId: firstQuestion.id,
            text: firstQuestion.text,
            category: firstQuestion.category,
            difficulty: firstQuestion.difficulty
          }
        ],
        startedAt: new Date()
      });

      // 5. Send first question to client
      socket.emit("interview_started", {
        sessionId: session._id.toString(),
        question: {
          id: firstQuestion.id,
          text: firstQuestion.text,
          category: firstQuestion.category,
          difficulty: firstQuestion.difficulty
        },
        questionNumber: 1,
        totalQuestions
      });

      console.log("✅ Interview started with session ID:", session._id);

    } catch (error) {
      console.error("❌ Start interview error:", error);
      socket.emit("error", { 
        message: "Failed to start interview. Please try again." 
      });
    }
  });

  // ========================================
  // Event: Submit Answer
  // ========================================
  socket.on("submit_answer", async (data) => {
    try {
      const { sessionId, questionId, answer, timeSpent } = data;
      const userId = socket.userId;

      console.log(`📝 Received answer for question:`, questionId);

      // 1. Verify session belongs to user
      const session = await InterviewSession.findOne({ 
        _id: sessionId, 
        userId 
      });

      if (!session) {
        return socket.emit("error", { message: "Session not found or access denied" });
      }

      if (session.status !== "in-progress") {
        return socket.emit("error", { message: "Interview is not in progress" });
      }

      // 2. Show "AI is thinking..."
      socket.emit("ai_thinking", { status: "processing" });

      // 3. Find the question
      const questionIndex = session.questions.findIndex(
        q => q.questionId === questionId
      );

      if (questionIndex === -1) {
        return socket.emit("error", { message: "Question not found" });
      }

      const question = session.questions[questionIndex];

      // 4. Evaluate answer with AI (streaming)
      console.log("🤖 Evaluating answer with AI...");
      
      const evaluation = await evaluateAnswer({
        question: question.text,
        answer: answer.trim(),
        category: question.category,
        difficulty: question.difficulty,
        onStream: (chunk) => {
          // Send streaming feedback to client
          socket.emit("evaluation_stream", { chunk });
        }
      });

      console.log(`✅ Evaluation complete. Score: ${evaluation.score}/10`);

      // 5. Update session with answer and evaluation
      session.questions[questionIndex].answer = answer.trim();
      session.questions[questionIndex].evaluation = evaluation;
      session.questions[questionIndex].timeSpent = timeSpent || 0;
      session.questions[questionIndex].answeredAt = new Date();
      session.currentQuestionIndex = questionIndex + 1;

      await session.save();

      // 6. Send evaluation complete
      socket.emit("evaluation_complete", {
        score: evaluation.score,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements
      });

      // 7. Calculate total time spent
      const totalTimeSpent = session.questions.reduce((sum, q) => sum + (q.timeSpent || 0), 0);
      session.totalTimeSpent = totalTimeSpent;
      await session.save();

      // 8. Check if interview is complete
      if (session.currentQuestionIndex >= session.totalQuestions) {
        console.log("🏁 All questions answered. Completing interview...");
        
        // Generate final report after 3 seconds
        setTimeout(async () => {
          await completeInterview(socket, session);
        }, 3000);
        
      } else {
        console.log(`➡️ Generating next question (${session.currentQuestionIndex + 1}/${session.totalQuestions})...`);
        
        // Generate next question after 3 seconds
        setTimeout(async () => {
          await sendNextQuestion(socket, session);
        }, 3000);
      }

    } catch (error) {
      console.error("❌ Submit answer error:", error);
      socket.emit("error", { 
        message: "Failed to process answer. Please try again." 
      });
    }
  });

  // ========================================
  // Event: Skip Question
  // ========================================
  socket.on("skip_question", async (data) => {
    try {
      const { sessionId } = data;
      const userId = socket.userId;

      console.log("⏭️ Question skipped");

      const session = await InterviewSession.findOne({ 
        _id: sessionId, 
        userId 
      });

      if (!session) {
        return socket.emit("error", { message: "Session not found" });
      }

      // Mark current question as skipped
      const currentIndex = session.currentQuestionIndex;
      
      if (currentIndex < session.questions.length) {
        session.questions[currentIndex].answer = "[SKIPPED]";
        session.questions[currentIndex].evaluation = {
          score: 0,
          feedback: "Question was skipped",
          strengths: [],
          improvements: ["Answer the question to get feedback"]
        };
        session.currentQuestionIndex += 1;
        await session.save();
      }

      // Send next question or complete
      if (session.currentQuestionIndex >= session.totalQuestions) {
        await completeInterview(socket, session);
      } else {
        await sendNextQuestion(socket, session);
      }

    } catch (error) {
      console.error("❌ Skip question error:", error);
      socket.emit("error", { message: "Failed to skip question" });
    }
  });

  // ========================================
  // Event: Pause Interview
  // ========================================
  socket.on("pause_interview", async (data) => {
    try {
      const { sessionId } = data;
      
      await InterviewSession.findByIdAndUpdate(sessionId, {
        status: "paused"
      });
      
      socket.emit("interview_paused");
      console.log("⏸️ Interview paused:", sessionId);
      
    } catch (error) {
      socket.emit("error", { message: "Failed to pause interview" });
    }
  });

  // ========================================
  // Event: Resume Interview
  // ========================================
  socket.on("resume_interview", async (data) => {
    try {
      const { sessionId } = data;
      
      await InterviewSession.findByIdAndUpdate(sessionId, {
        status: "in-progress"
      });
      
      socket.emit("interview_resumed");
      console.log("▶️ Interview resumed:", sessionId);
      
    } catch (error) {
      socket.emit("error", { message: "Failed to resume interview" });
    }
  });
}

// ========================================
// Helper: Send Next Question
// ========================================
async function sendNextQuestion(socket, session) {
  try {
    const user = await User.findById(session.userId);
    const resume = await Resume.findOne({ userId: session.userId });

    const nextQuestionNumber = session.currentQuestionIndex + 1;

    console.log(`🤖 Generating question ${nextQuestionNumber}/${session.totalQuestions}...`);

    const nextQuestion = await generateQuestion({
      type: session.type,
      difficulty: session.difficulty,
      profile: user.profile || {},
      resume: resume?.parsedData || {},
      questionNumber: nextQuestionNumber,
      previousQuestions: session.questions
    });

    console.log("✅ Next question generated");

    // Add to session
    session.questions.push({
      questionId: nextQuestion.id,
      text: nextQuestion.text,
      category: nextQuestion.category,
      difficulty: nextQuestion.difficulty
    });

    await session.save();

    socket.emit("next_question", {
      question: {
        id: nextQuestion.id,
        text: nextQuestion.text,
        category: nextQuestion.category,
        difficulty: nextQuestion.difficulty
      },
      questionNumber: nextQuestionNumber,
      totalQuestions: session.totalQuestions
    });

    console.log(`➡️ Sent question ${nextQuestionNumber}/${session.totalQuestions}`);

  } catch (error) {
    console.error("❌ Error sending next question:", error);
    socket.emit("error", { message: "Failed to generate next question" });
  }
}

// ========================================
// Helper: Complete Interview
// ========================================
async function completeInterview(socket, session) {
  try {
    console.log("🏁 Completing interview...");

    // Calculate overall score
    const overallScore = session.calculateOverallScore();
    
    // Get category breakdown
    const categoryBreakdown = session.getCategoryBreakdown();
    
    // Generate final report
    const finalReport = await generateFinalReport(session);

    // Update session
    session.status = "completed";
    session.completedAt = new Date();
    session.overallScore = overallScore;
    session.finalReport = {
      ...finalReport,
      categoryScores: categoryBreakdown
    };

    await session.save();

    // Count answered questions
    const answeredCount = session.questions.filter(
      q => q.answer && q.answer !== "[SKIPPED]"
    ).length;

    // Send final report
    socket.emit("interview_complete", {
      sessionId: session._id.toString(),
      overallScore,
      report: session.finalReport,
      questionsAnswered: answeredCount,
      totalQuestions: session.totalQuestions,
      totalTimeSpent: session.totalTimeSpent
    });

    console.log(`🎉 Interview completed! Score: ${overallScore}/100`);

  } catch (error) {
    console.error("❌ Error completing interview:", error);
    socket.emit("error", { message: "Failed to complete interview" });
  }
}