import express from "express";
import pool from "../config/db.js";
import { uploadPDF } from "../controllers/pdfController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadPDF);

router.get("/", protect, async (req, res) => {
  try {
    const docs = await pool.query(
      "SELECT * FROM documents WHERE user_id = $1 ORDER BY id DESC",
      [req.user.id]
    );

    res.json(docs.rows);
  } catch (err) {
    console.error("GET DOCS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;