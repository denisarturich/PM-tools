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
