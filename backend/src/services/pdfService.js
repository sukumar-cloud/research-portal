const fs = require("fs");
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

async function extractText(filePath) {
  console.log("📄 Extracting text using pdf-parse...");

  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);

  const text = (data.text || "").trim();

  if (!text || text.length < 50) {
    throw new Error("PDF contains no selectable text (likely scanned). OCR not supported in deployed version.");
  }

  return text;
}

module.exports = { extractText };
