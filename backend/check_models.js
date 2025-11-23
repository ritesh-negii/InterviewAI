import 'dotenv/config'; // Loads your .env file

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("🔍 Asking Google for your available models...");

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      console.error("❌ Error:", data.error.message);
    } else {
      console.log("\n✅ SUCCESS! You can use these EXACT names in your code:\n");
      // Filter for models that support content generation
      const models = data.models
        .filter(m => m.supportedGenerationMethods.includes("generateContent"))
        .map(m => m.name.replace("models/", "")); 
      
      console.log(models);
    }
  })
  .catch(err => console.error("Network Error:", err));