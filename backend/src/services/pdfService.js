const fs = require("fs");
const path = require("path");
const pdf = require("pdf-poppler");
const Tesseract = require("tesseract.js");

async function extractText(filePath) {
  console.log("🔎 Starting OCR extraction...");

  const outputDir = path.join(__dirname, "../../uploads");

  const options = {
    format: "png",
    out_dir: outputDir,
    out_prefix: "page",
    page: null
  };

  // Convert PDF to images
  await pdf.convert(filePath, options);

  const files = fs.readdirSync(outputDir)
    .filter(file => file.startsWith("page") && file.endsWith(".png"));

  let fullText = "";

  for (let i = 0; i < files.length; i++) {
    const imagePath = path.join(outputDir, files[i]);

    console.log(`📄 Processing ${files[i]}...`);

    const result = await Tesseract.recognize(imagePath, "eng");

    fullText += result.data.text + "\n";

    // Delete image after processing
    fs.unlinkSync(imagePath);
  }

  console.log("✅ OCR extraction complete");

  return fullText.trim();
}

module.exports = { extractText };
