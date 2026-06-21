import { extractTextFromPDF, uploadToSupabase, getSignedUrl } from "../services/pdfService.js";
import pool from "../config/db.js";
import { fileTypeFromFile } from "file-type";
 import { fileTypeFromBuffer } from "file-type";
import fs from "fs";

export const getPDF = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM documents WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    const filePath = result.rows[0].path;

    const url = await getSignedUrl(filePath);

    res.json({
      id: result.rows[0].id,
      title: result.rows[0].title,
      content: result.rows[0].content,
      url,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching PDF" });
  }
};


// export const uploadPDF = async (req, res) => {
//   try {
//     const file = req.file;
//     const { title } = req.body;

//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }
//         // Check file type
//     const fileType = await fileTypeFromFile(req.file.path);

//     if (!fileType || fileType.mime !== "application/pdf") {
//       // Delete fake file
//       fs.unlinkSync(req.file.path);

//       return res.status(400).json({ message: "Invalid file type (not real PDF)" });
//     }

// // 1. Extract text (keep this)
// // const text = await extractTextFromPDF(file.path);
// const text = await extractTextFromPDF(file.buffer);

// // 2. Upload to Supabase
// const supabasePath = await uploadToSupabase(file, req.user.id);

// // 3. Save to DB
// // const result = await pool.query(
// //   "INSERT INTO documents (user_id, path, content, title) VALUES ($1, $2, $3, $4) RETURNING *",
// //   [req.user.id, supabasePath, text, title]
// // );
// const result=await pool.query(
//   `INSERT INTO documents (user_id, filename, path, content, title) 
//    VALUES ($1, $2, $3, $4, $5)`,
//   [req.user.id, file.originalname, filePath, text, title]
// );
// fs.unlinkSync(file.path);

//     res.status(201).json({
//       message: "PDF uploaded & processed",
//       document: result.rows[0],
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error processing PDF" });
//   }
// };

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

// export const uploadPDF = async (req, res) => {
//   try {
//     const file = req.file;

//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     // 🔥 Upload to Supabase instead of local storage
//     const filePath = await uploadToSupabase(file, req.user.id);

//     // Save in DB
//     const result = await pool.query(
//       "INSERT INTO documents (user_id, filename, path) VALUES ($1, $2, $3) RETURNING *",
//       [req.user.id, file.originalname, filePath]
//     );

//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error("UPLOAD ERROR:", err);
//     res.status(500).json({ message: "Upload failed" });
//   }
// };

export const uploadPDF = async (req, res) => {
  try {
    const file = req.file;
    const { title } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Check file type


const type = await fileTypeFromBuffer(file.buffer);

if (!type || type.mime !== "application/pdf") {
  return res.status(400).json({ message: "Invalid PDF" });
}

    // Extract text
    const text = await extractTextFromPDF(file.buffer);

    // Upload to Supabase
    const supabasePath = await uploadToSupabase(file, req.user.id);

    // Save to DB
    const result = await pool.query(
      `INSERT INTO documents (user_id, filename, path, content, title) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, file.originalname, supabasePath, text, title]
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