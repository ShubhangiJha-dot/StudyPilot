import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app=express()
app.use(cors())
app.use(express.json())
const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://study-pilot-ruddy.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.get('/', (req,res)=>{
    res.send("StudyPilot API running")
})

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

app.use("/api/auth", authRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/ai", aiRoutes);
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));