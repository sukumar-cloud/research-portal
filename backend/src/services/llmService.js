const axios = require("axios");
const { earningsCallPrompt } = require("../prompts/earningsprompt");
const { chunkText } = require("../utils/chunk");

const GROQ_API_KEY = process.env.GROQ_API_KEY;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function analyzeChunk(chunk, retries = 3) {
  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: earningsCallPrompt(chunk) }],
        temperature: 0
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`
        }
      }
    );

    return JSON.parse(response.data.choices[0].message.content);

  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      console.log("Rate limit hit. Waiting 8 seconds...");
      await sleep(8000);
      return analyzeChunk(chunk, retries - 1);
    }
    throw error;
  }
}

async function analyzeEarningsCall(fullTranscript) {
  const chunks = chunkText(fullTranscript, 2000);
  let results = [];

  for (const chunk of chunks) {
    const data = await analyzeChunk(chunk);
    results.push(data);
    await sleep(4000);
  }

  return mergeResults(results);
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

  // Clean & limit counts
  final.key_positives = [...new Set(final.key_positives)].slice(0, 5);
  final.key_concerns = [...new Set(final.key_concerns)].slice(0, 5);
  final.growth_initiatives = [...new Set(final.growth_initiatives)].slice(0, 3);

  return final;
}

module.exports = { analyzeEarningsCall };
