const earningsCallPrompt = (transcriptText) => `
You are a financial research analyst.

Your task is to analyze the following earnings call transcript
and produce a STRICTLY STRUCTURED JSON output.

RULES (VERY IMPORTANT):
- Use ONLY the information explicitly stated in the transcript.
- DO NOT infer, assume, or guess anything.
- If a data point is not mentioned, write "Not mentioned".
- Do NOT add explanations or extra text.
- Return ONLY valid JSON. No markdown. No comments.

Required JSON format:

{
  "management_tone": "Optimistic | Neutral | Cautious | Pessimistic | Not mentioned",
  "confidence_level": "High | Medium | Low | Not mentioned",
  "key_positives": [],
  "key_concerns": [],
  "forward_guidance": {
    "revenue": "string or Not mentioned",
    "margin": "string or Not mentioned",
    "capex": "string or Not mentioned"
  },
  "capacity_utilization": "string or Not mentioned",
  "growth_initiatives": []
}

Transcript:
"""
${transcriptText}
"""
`;

module.exports = { earningsCallPrompt };
