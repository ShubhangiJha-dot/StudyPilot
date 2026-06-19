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
Summarize the following text into ONLY 5-6 short bullet points.

Rules:
- Give only pointers not "Here is the summary..."
- Focus only on key ideas
- Give one pointer for each subheading/topic if possible describing the crux idea of that section
- Keep it brief but use academic tone preferably to help in exams
- Each subheading/topic should've been mentioned
- Use less than 20 words for each pointer

Text:
${text}
`;
  return await generateResponse(prompt);
};


// 2. Concept Explainer
export const explainConcept = async (topic) => {
const prompt = `
Explain the following topic in very simple terms.

Rules:
- Directly start with the explanation, not headers or subheadings
- Keep it under 200 words
- Use simple language, but add academic tone so student knows how to frame it in an essay
- No long paragraphs
- Make it easy for a student to understand

Topic:
${topic}
`;
  return await generateResponse(prompt);
};

// 3. Quiz Generator (with JSON safety)
export const generateQuiz = async (text, numQuestions) => {
  const trimmed = text.slice(0, 4000);

  const prompt = `
Generate ${numQuestions} multiple choice questions from the text.

Rules:
- 4 options each
- Only one correct answer
- Include explanation (1 line)
- Keep questions simple

Return STRICT JSON like this:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "explanation": "..."
  }
]

Text:
${trimmed}
`;

  const response = await generateResponse(prompt);
const clean = response.replace(/```json|```/g, "").trim();
return JSON.parse(clean);
};