# Research Portal – Earnings Call Summary Tool

An AI-powered platform that analyzes earnings call transcripts and generates structured analyst summaries using LLMs.

---

## 🚀 Overview

This system enables users to upload earnings call transcripts and automatically extract key insights in a structured format.

### Key Outputs

* Management Tone (Optimistic / Neutral / Cautious / Pessimistic)
* Confidence Level (High / Medium / Low)
* Key Positives (3–5 points)
* Key Concerns (3–5 points)
* Forward Guidance (Revenue, Margin, Capex)
* Capacity Utilization Trends
* Growth Initiatives

The output is clean, structured, and suitable for research and analysis workflows.

---

## 🛠 Tech Stack

### Frontend

* React (Vite)

### Backend

* Node.js
* Express.js
* Multer (file upload)
* pdf-parse (text extraction)

### LLM

* Groq API (Llama 3.1)
* Structured prompt engineering
* Chunk-based processing

### Deployment

* Vercel (Frontend)
* Render (Backend)

---

## ⚙️ How It Works

1. User uploads a transcript PDF
2. Backend extracts selectable text
3. Transcript is split into chunks to handle token limits
4. Each chunk is processed by the LLM
5. Structured JSON outputs are generated
6. Results are merged into a final summary

---

## 🔄 Core Features

### 📄 Document Processing

* Supports large transcript files
* Efficient chunking to avoid token overflow

### 🧠 LLM Integration

* Strict JSON-based prompt enforcement
* Deterministic outputs with minimal hallucination

### ⚡ Reliability Handling

* Retry and delay mechanisms for API rate limits
* Graceful handling of incomplete data

### 🎯 Structured Output

* Clean, analyst-friendly format
* No chatbot-style responses

---

## ⚠️ Limitations

* Supports only text-based PDFs
* Scanned/image PDFs are not supported in production
* Performance may vary due to free-tier hosting constraints

---

## 📡 Deployment

### Backend (Render)

* Root directory: `backend`
* Start command: `node src/app.js`
* Environment variable:

  * `GROQ_API_KEY`

### Frontend (Vercel)

* Root directory: `frontend`
* Environment variable:

  * `VITE_API_BASE_URL=https://your-backend-url.onrender.com`

---

## 🎯 Key Highlights

* LLM-powered document analysis pipeline
* Chunk-based processing for scalability
* Structured JSON output for reliability
* End-to-end full-stack implementation
* Production deployment with real-world constraints

---

## 👨‍💻 Author

Built as a full-stack AI project focusing on document processing, prompt engineering, and scalable LLM integration.
