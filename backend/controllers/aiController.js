import {
  generateSummary,
  explainConcept,
  generateQuiz,
} from "../services/aiService.js";


import pool from "../config/db.js";

export const getSummary = async (req, res) => {
  try {
    const { documentId } = req.body;

    console.log("DOCUMENT ID:", documentId);
    console.log("USER ID:", req.user.id);

    const result = await pool.query(
      "SELECT content FROM documents WHERE id = $1 AND user_id = $2",
      [documentId, req.user.id]
    );

    console.log("DB RESULT:", result.rows);

    const text = result.rows[0]?.content;

    if (!text) {
      console.log("❌ TEXT NOT FOUND");
      return res.status(400).json({ message: "Document text missing" });
    }

    console.log("✅ TEXT FOUND LENGTH:", text.length);

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