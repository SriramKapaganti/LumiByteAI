// gemini.js
const { GoogleGenAI } = require("@google/genai");

// Load API Key from environment variable
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function askGemini(question) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question,
    });

    return response.text;
  } catch (err) {
    console.error("Gemini Error:", err);
    return "Error communicating with Gemini API.";
  }
}

module.exports = { askGemini };
