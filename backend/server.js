import express from "express";
import multer from "multer";
import fs from "fs";
import { analyzeFood } from "./services/analyzeFood.js";
import { loadModel } from "./ai/yolo.js";
import "dotenv/config"; 
const app = express();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// Health check
app.get("/", (_, res) => {
  res.send("✅ NutriScan Server is running");
});

//Image → Food → Nutrition
app.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imageBuffer = req.file.buffer;

    // Main pipeline: YOLO → Food → Nutrition
    const analysis = await analyzeFood(imageBuffer);

    res.json({
      success: true,
      count: analysis.length,
      results: analysis
    });

  } catch (err) {
    console.error("❌ Analysis error:", err);
    res.status(500).json({ error: "Food analysis failed" });
  }
});

app.listen(8080, () => {
  console.log("Server running at http://localhost:8080");
});
