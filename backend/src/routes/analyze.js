const express = require("express");
const multer = require("multer");
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

    const text = await extractText(req.file.path);
    console.log("TRANSCRIPT PREVIEW:", String(text).slice(0, 500));

const limitedText = text.slice(0, 12000);
const analysis = await analyzeEarningsCall(limitedText);

    let parsed;
    try {
      parsed = JSON.parse(analysis);
    } catch (parseError) {
      console.error("JSON PARSE ERROR:", parseError, "RAW OUTPUT:", analysis);
      return res.status(500).json({ error: "Model did not return valid JSON" });
    }

    return res.json(parsed);
  } catch (error) {
    console.error("ANALYZE ERROR:", error);
    return res.status(500).json({
      error: "Analysis failed",
      details: error.message || String(error)
    });
  }
});

module.exports = router;
