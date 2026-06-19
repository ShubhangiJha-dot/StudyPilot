import {
  generateSummary,
  explainConcept,
  generateQuiz,
} from "../services/aiService.js";

// Summary
export const getSummary = async (req, res) => {
  try {
    const { text } = req.body;

    const summary = await generateSummary(text);

    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating summary" });
  }
};

// Explain
export const getExplanation = async (req, res) => {
  try {
    const { topic } = req.body;

    const explanation = await explainConcept(topic);

    res.json({ explanation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error explaining concept" });
  }
};

// Quiz
export const getQuiz = async (req, res) => {
  try {
    const { text, numQuestions } = req.body;

    const quiz = await generateQuiz(text, numQuestions);

    res.json({ quiz });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Quiz generation failed" });
  }
};