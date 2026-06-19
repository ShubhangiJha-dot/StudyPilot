import { GoogleGenAI } from "@google/genai";

// Correct initialization
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

//  Core reusable function
const generateResponse = async (prompt) => {
  try {
    const response = await genAI.models.generateContent({
      // model: "gemini-1.5-flash",
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("AI Error FULL:", {
      message: error.message,
      status: error.status,
      stack: error.stack,
    });
    throw error;
  }
};


// 1. Summary
export const generateSummary = async (text) => {
  const prompt = `
Summarize the following text into clear bullet points:

${text}
  `;
  return await generateResponse(prompt);
};


// 2. Concept Explainer
export const explainConcept = async (topic) => {
  const prompt = `
Explain the following topic in simple terms like a teacher:

${topic}
  `;
  return await generateResponse(prompt);
};

// 3. Quiz Generator (with JSON safety)
export const generateQuiz = async (text) => {
  const prompt = `
Generate 5 multiple choice questions from the text below.

Return ONLY valid JSON in this format:
[
  {
    "question": "",
    "options": ["", "", "", ""],
    "answer": ""
  }
]

Text:
${text}
  `;

  const raw = await generateResponse(prompt);

  // ✅ Clean + parse JSON safely
  try {
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error("Quiz JSON Parse Error:", raw);
    throw new Error("Failed to parse quiz JSON");
  }
};