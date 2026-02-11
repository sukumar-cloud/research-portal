function earningsCallPrompt(transcriptChunk) {
  return `
You are a senior institutional equity research analyst.

Analyze ONLY the information explicitly mentioned in the transcript below.

STRICT RULES:
- Do NOT assume.
- Do NOT generalize.
- Do NOT repeat vague statements.
- If something is not clearly mentioned, write "Not mentioned".
- Extract only concrete facts.
- Avoid duplication.
- Return STRICTLY valid JSON.
- No explanations outside JSON.

Required JSON format:

{
  "management_tone": "",
  "confidence_level": "",
  "key_positives": [],
  "key_concerns": [],
  "forward_guidance": {
    "revenue": "",
    "margin": "",
    "capex": ""
  },
  "capacity_utilization": "",
  "growth_initiatives": []
}

Transcript:
${transcriptChunk}
`;
}

module.exports = { earningsCallPrompt };
