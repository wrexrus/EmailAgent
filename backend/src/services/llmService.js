const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function runPrompt(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    // If using SDK format (v0.4+)
    if (result?.response?.candidates?.[0]?.content) {
      return result.response.candidates[0].content;
    }

    // Old format fallback (unlikely)
    if (typeof result === 'string') return result;
    
    return "⚠ Agent did not return content.";
  } catch (err) {
    console.error("LLM error:", err);
    return "⚠ LLM Error occurred. Check Gemini API key or prompt.";
  }
}

module.exports = { runPrompt };
