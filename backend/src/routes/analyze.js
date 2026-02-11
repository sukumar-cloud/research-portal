const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { extractText } = require("../services/pdfService");
const { analyzeEarningsCall } = require("../services/llmService");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Step 1: Extract OCR text
    const text = await extractText(req.file.path);
    console.log("TRANSCRIPT PREVIEW:", String(text).slice(0, 500));

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Transcript extraction failed" });
    }

    // Step 2: Analyze transcript
    const analysis = await analyzeEarningsCall(text);

    // Step 3: Delete uploaded PDF after processing
    try {
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.log("File cleanup warning:", err.message);
    }

    // Step 4: Send clean JSON response
    return res.json(analysis);

  } catch (error) {
    console.error("ANALYZE ERROR:", error);
    return res.status(500).json({
      error: "Analysis failed",
      details: error.message || String(error)
    });
  }
});

module.exports = router;
