const axios = require("axios");
const { earningsCallPrompt } = require("../prompts/earningsprompt");
const { chunkText } = require("../utils/chunk");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function analyzeChunk(chunk) {
  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "user", content: earningsCallPrompt(chunk) }
      ],
      temperature: 0
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`
      }
    }
  );

  return response.data.choices[0].message.content;
}

async function analyzeEarningsCall(fullTranscript) {
  const chunks = chunkText(fullTranscript, 3500);

  let combinedResults = [];

  for (const chunk of chunks) {
    const result = await analyzeChunk(chunk);
    try {
      combinedResults.push(JSON.parse(result));
    } catch (err) {
      console.error("Chunk JSON parse error:", result);
    }
  }

  return mergeResults(combinedResults);
}

function mergeResults(results) {
  const final = {
    management_tone: "Not mentioned",
    confidence_level: "Not mentioned",
    key_positives: [],
    key_concerns: [],
    forward_guidance: {
      revenue: "Not mentioned",
      margin: "Not mentioned",
      capex: "Not mentioned"
    },
    capacity_utilization: "Not mentioned",
    growth_initiatives: []
  };

  results.forEach(r => {
    if (r.management_tone !== "Not mentioned")
      final.management_tone = r.management_tone;

    if (r.confidence_level !== "Not mentioned")
      final.confidence_level = r.confidence_level;

    final.key_positives.push(...r.key_positives);
    final.key_concerns.push(...r.key_concerns);
    final.growth_initiatives.push(...r.growth_initiatives);

    if (r.forward_guidance.revenue !== "Not mentioned")
      final.forward_guidance.revenue = r.forward_guidance.revenue;

    if (r.forward_guidance.margin !== "Not mentioned")
      final.forward_guidance.margin = r.forward_guidance.margin;

    if (r.forward_guidance.capex !== "Not mentioned")
      final.forward_guidance.capex = r.forward_guidance.capex;

    if (r.capacity_utilization !== "Not mentioned")
      final.capacity_utilization = r.capacity_utilization;
  });

  // Remove duplicates
  final.key_positives = [...new Set(final.key_positives)];
  final.key_concerns = [...new Set(final.key_concerns)];
  final.growth_initiatives = [...new Set(final.growth_initiatives)];

  return JSON.stringify(final);
}

module.exports = { analyzeEarningsCall };
