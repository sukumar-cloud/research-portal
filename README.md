# Research Portal – Earnings Call Summary Tool

> **Option B** – Structured analyst summaries from earnings call transcripts.

## What this does
-- works only for thentext format now bcz of ocr issue.
A researcher uploads a PDF earnings call transcript. The system extracts text (OCR if needed) and produces a structured summary:

- Management tone (Optimistic / Neutral / Cautious / Pessimistic)
- Confidence level (High / Medium / Low)
- 3–5 key positives
- 3–5 key concerns
- Forward guidance (revenue, margin, capex)
- Capacity utilization trends
- 2–3 growth initiatives

The output is a clean, analyst‑ready JSON object displayed in the UI.

---

## Architecture

- **Frontend**: React (Vite) – white‑theme UI with file upload and formatted results.
- **Backend**: Node.js/Express – multipart upload, OCR fallback, LLM analysis.
- **LLM**: Groq (Llama‑3.1‑8b‑instant) with a strict prompt that returns only JSON.
- **OCR**: `pdf-poppler` + `tesseract.js` (fallback when text extraction is insufficient).

---

## Setup (local)

### Backend
```bash
cd backend
npm install
# Create .env with GROQ_API_KEY
node src/app.js
```
Server runs on `http://localhost:5000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` (proxies `/api/*` to backend).

---

## Deployment notes

- **Backend**: Deploy on Render, Railway, or similar. Set `GROQ_API_KEY` in environment.
- **Frontend**: Deploy on Vercel/Netlify. Ensure the API proxy points to the deployed backend URL.
- **File size limit**: 10 MB (configurable in `routes/analyze.js`).
- **OCR on serverless**: OCR can be slow on cold starts; most PDFs will use `pdf-poppler` text extraction first.
- **Rate limits**: Groq rate‑limits are handled with retries and 4‑second delays between chunks.

---

## How it works (Option B)

1. **Upload** → PDF is stored temporarily in `uploads/`.
2. **Text extraction** → Try `pdf-poppler` first; if insufficient, run OCR via `tesseract.js`.
3. **Chunking** → Transcript is split into 2000‑character chunks to stay within model limits.
4. **LLM analysis per chunk** → Each chunk is sent to Groq with a strict JSON prompt.
5. **Merge results** → Consolidate tone, confidence, positives/concerns, guidance, capacity, and initiatives.
6. **Cleanup** → Temporary files are deleted.
7. **Display** → Frontend renders a clean, sectioned summary.

---

## Key design choices

- **No hallucination**: Prompt forces “Not mentioned” for missing data; we never infer.
- **Structured output**: Always the same JSON schema; frontend renders it as headings/bullets.
- **Graceful OCR**: If native PDF text is too short, we fall back to OCR without external tools.
- **Rate‑limit safety**: Built‑in retries and delays.

---

## Limitations

- OCR can be slow on large PDFs; consider limiting pages or using pre‑extracted text.

---

## OCR & Deployment notes

- **Local development**: OCR via `pdf-poppler` + `tesseract.js` works very well on Windows/macOS.
- **Render deployment**: Linux serverless environments don’t support the native binaries `tesseract.js` needs, so OCR was removed. We now use `pdf-parse` for selectable text only.
- **Production recommendation**: Use a paid cloud OCR service (e.g., Google Cloud Vision OCR) for reliable, server‑compatible text extraction from scanned PDFs. This would improve accuracy and avoid platform‑specific dependencies.

---

### License

MIT.
