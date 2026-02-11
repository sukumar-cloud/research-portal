function earningsCallPrompt(transcriptText) {
  return `
You are a professional equity research analyst.

Analyze ONLY the information explicitly stated in the transcript below.

STRICT RULES:
- Return ONLY valid JSON.
- Do NOT hallucinate.
- Do NOT assume missing data.
- If not mentioned explicitly, write "Not mentioned".
- Consolidate similar ideas.
- Each bullet must contain a specific operational, financial, or strategic detail explicitly mentioned in the transcript.
- Avoid generic phrases like "strong performance", "clear strategy", or "good growth".
- Limit to required counts strictly.

Tone must be one of:
"Optimistic", "Neutral", "Cautious", "Pessimistic"

Confidence must be one of:
"High", "Medium", "Low"

Output format (STRICT):

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

Constraints:
- key_positives: 3–5 items
- key_concerns: 3–5 items
- growth_initiatives: 2–3 items
- If guidance is vague, describe it conservatively.
- Do not invent numbers.

Transcript:
${transcriptText}
`;
}

module.exports = { earningsCallPrompt };
