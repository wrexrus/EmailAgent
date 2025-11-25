const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function runPrompt(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    console.log("Gemini API Key loaded:", process.env.GEMINI_API_KEY);

    let response = result?.response?.candidates?.[0]?.content;

    if (typeof response === "object" && response?.parts) {
      return response.parts.map(p => p.text).join("\n");
    }

    if (typeof response !== "string") return JSON.stringify(response);
    return response;
  } catch (err) {
    console.error("LLM error:", err);
    return null;
  }
}

module.exports = { runPrompt };
