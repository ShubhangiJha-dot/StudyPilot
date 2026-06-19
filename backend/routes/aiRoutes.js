import express from "express";
import {
  getSummary,
  getExplanation,
  getQuiz,
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/summary", protect, getSummary);
router.post("/explain", protect, getExplanation);
router.post("/quiz", protect, getQuiz);

export default router;