import { extractTextFromPDF } from "../services/pdfService.js";
import pool from "../config/db.js";
import { fileTypeFromFile } from "file-type";
import fs from "fs";

export const uploadPDF = async (req, res) => {
  try {
    const file = req.file;
    const { title } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
        // Check file type
    const fileType = await fileTypeFromFile(req.file.path);

    if (!fileType || fileType.mime !== "application/pdf") {
      // Delete fake file
      fs.unlinkSync(req.file.path);

      return res.status(400).json({ message: "Invalid file type (not real PDF)" });
    }

    // 1. Extract text
    const text = await extractTextFromPDF(file.path);

    // 2. Save to DB
    const result = await pool.query(
      "INSERT INTO documents (user_id, filename, content,title) VALUES ($1, $2, $3, $4) RETURNING *",
      [req.user.id, file.filename, text, title]
    );

    res.status(201).json({
      message: "PDF uploaded & processed",
      document: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing PDF" });
  }
};

export const getUserDocuments = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM documents WHERE user_id = $1 ORDER BY id DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching documents" });
  }
};