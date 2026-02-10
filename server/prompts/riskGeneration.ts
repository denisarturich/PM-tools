export const RISK_GENERATION_PROMPT = (projectDescription: string) => `
Based on this project description, generate 5-7 realistic risks:

"${projectDescription}"

Analyze the project type, timeline, and complexity to identify risks across these categories:
- Technical risks (architecture, dependencies, performance)
- Resource risks (staffing, budget, expertise)
- Timeline risks (deadlines, dependencies, scope creep)
- External risks (vendors, regulations, market changes)
- Operational risks (deployment, maintenance, support)

For each risk, provide in JSON format:
{
  "task": "Specific task or project area",
  "risk": "Clear description of what could go wrong",
  "impact": "Specific consequences (include numbers, timeframes, costs where possible)",
  "impactStrength": "low" | "medium" | "high",
  "probability": "low" | "medium" | "high"
}

Return a JSON array of risks, followed by a brief summary grouped by priority (High/Medium/Low).

Format:
\`\`\`json
[
  { ... },
  { ... }
]
\`\`\`

Then provide a natural language summary of the risks.`;
