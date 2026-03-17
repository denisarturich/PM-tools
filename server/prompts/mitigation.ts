export const MITIGATION_PROMPT = (risk: any) => `
Suggest mitigation strategies for this risk:

**Risk**: ${risk.risk}
**Impact**: ${risk.impact || 'Not specified'}
**Impact Strength**: ${risk.impactStrength || 'Not specified'}
**Probability**: ${risk.probability || 'Not specified'}
**Task/Area**: ${risk.task || 'Not specified'}

Provide 4-6 specific, actionable mitigation steps covering:

1. **Prevention Strategies**: How to reduce the probability of this risk occurring
2. **Impact Reduction**: How to minimize consequences if it does occur
3. **Monitoring**: How to detect early warning signs
4. **Recovery Procedures**: How to respond if the risk materializes
5. **Ownership**: Who should be responsible for each action

Each step should be:
- Concrete and implementable (not generic advice)
- 1-2 sentences
- Include timeframes where relevant
- Assign clear ownership where possible

Format your response with clear sections and bullet points.`;

export const MITIGATION_PROMPT_MULTIPLE = (risks: any[]) => {
  if (!risks || risks.length === 0) {
    return 'No risks available to analyze.';
  }

  const risksText = risks.map((risk, index) => 
    `### ${index + 1}. ${risk.risk}
   - **Impact**: ${risk.impact || 'Not specified'}
   - **Impact Strength**: ${risk.impactStrength || 'Not specified'}
   - **Probability**: ${risk.probability || 'Not specified'}
   - **Task/Area**: ${risk.task || 'Not specified'}
   - **Current Actions**: ${risk.actions || 'None'}
   - **ROAM Status**: ${risk.roaming || 'Not set'}`
  ).join('\n\n');

  return `You are a risk management expert. Analyze the following ${risks.length} risks and suggest concrete mitigation strategies for each one.

## Current Risks

${risksText}

## Instructions

For each risk, provide:

1. **Root Cause Analysis** - Why this risk exists (1-2 sentences)
2. **Prevention Strategy** - Specific actions to reduce probability (2-3 concrete steps)
3. **Impact Reduction** - How to minimize consequences if it occurs (2-3 concrete steps)
4. **Early Warning Indicators** - What signals to monitor
5. **Contingency Plan** - Immediate actions if the risk materializes

## Requirements

- Be specific and actionable (avoid generic advice)
- Include timeframes where relevant
- Suggest clear ownership/responsibility
- Prioritize high-impact, high-probability risks
- Format response in clear markdown with headings for each risk

## Response Format

Structure your response with:
- Clear heading for each risk (use the risk number and title)
- Organized sections within each risk
- Bullet points for actionable items
- Summary of priority actions at the end

Focus on practical, implementable strategies that the team can execute immediately.`;
};
