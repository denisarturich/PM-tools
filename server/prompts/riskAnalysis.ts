export const RISK_ANALYSIS_PROMPT = (risks: any[]) => {
  const risksSummary = risks.map((r, i) => 
    `${i + 1}. [${r.impactStrength}/${r.probability}] ${r.risk} ${r.roaming ? `(${r.roaming})` : '(unprocessed)'}`
  ).join('\n');

  return `Analyze these ${risks.length} project risks:

${risksSummary}

Provide a comprehensive analysis covering:

1. **Critical Issues** (count):
   - High impact + High probability risks without mitigation
   - These need immediate attention

2. **ROAM Coverage**:
   - Percentage of risks with ROAM status assigned
   - Calculate: (risks with status / total risks) × 100

3. **Top 3 Insights**:
   - Patterns you notice (e.g., clustering in specific areas)
   - Gaps in coverage (e.g., no operational risks)
   - Risk interdependencies

4. **Recommendations**:
   - Prioritization advice (which risks to tackle first)
   - Suggested next actions
   - Areas needing more attention

Be specific and actionable. Include numbers and percentages.`;
};
