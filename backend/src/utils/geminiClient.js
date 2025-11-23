import { GoogleGenerativeAI } from "@google/generative-ai";

export const analyzeResumeWithGemini = async (resumeText) => {
  // 1. Debug inside the function to see the state at EXECUTION time
  console.log("DEBUG: API Key inside function:", process.env.GEMINI_API_KEY ? "Exists" : "Missing");

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API Key is missing in environment variables");
  }

  // 2. Initialize Client HERE (Lazy Loading)
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ MATCHES YOUR LIST EXACTLY
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
    You are a strictly technical resume parser. 
    Analyze the text below and output ONLY raw JSON. 
    Do not include markdown formatting like \`\`\`json or \`\`\`.
    
    Structure:
    {
      "skills": ["skill1", "skill2"],
      "projects": [{"name": "proj1", "description": "desc"}],
      "education": [{"degree": "B.Tech", "institution": "XYZ"}]
    }

    Resume Text:
    ${resumeText}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // 3. CRITICAL: Clean the output (Remove Markdown backticks if Gemini adds them)
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    // 4. Parse string to actual JSON object before returning
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to analyze resume");
  }
};