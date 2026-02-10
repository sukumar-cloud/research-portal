const { earningsCallPrompt } = require("../prompts/earningsprompt");

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function analyzeEarningsCall(transcriptText) {
  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: earningsCallPrompt(transcriptText)
        }
      ],
      temperature: 0
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Groq API error: ${response.status} ${errText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

module.exports = { analyzeEarningsCall };