/**
 * Extract JSON array from Claude response
 */
export function extractJSON(text: string): any[] {
  // Try to find JSON in code blocks first
  const codeBlockMatch = text.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1]);
    } catch (e) {
      console.error('Failed to parse JSON from code block:', e);
    }
  }

  // Try to find JSON array in text
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('Failed to parse JSON from text:', e);
    }
  }

  return [];
}

/**
 * Extract text after JSON (typically a summary)
 */
export function extractTextAfterJSON(text: string): string {
  const codeBlockMatch = text.match(/```(?:json)?[\s\S]*?```\s*([\s\S]*)/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  const jsonMatch = text.match(/\][\s\S]*([\s\S]*)/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }

  return text;
}

/**
 * Extract mitigation actions from response
 */
export function extractMitigationActions(text: string): string[] {
  const actions: string[] = [];
  
  // Try to find numbered lists
  const numberedRegex = /(?:^|\n)\d+\.\s*\*\*([^*]+)\*\*:?\s*([^\n]+)/g;
  const numberedMatches = Array.from(text.matchAll(numberedRegex));
  for (const match of numberedMatches) {
    actions.push(`${match[1]}: ${match[2]}`);
  }

  if (actions.length > 0) return actions;

  // Try to find bullet lists
  const bulletRegex = /(?:^|\n)[-•]\s*\*\*([^*]+)\*\*:?\s*([^\n]+)/g;
  const bulletMatches = Array.from(text.matchAll(bulletRegex));
  for (const match of bulletMatches) {
    actions.push(`${match[1]}: ${match[2]}`);
  }

  if (actions.length > 0) return actions;

  // Fallback: split by lines that look like actions
  const lines = text.split('\n').filter(line => 
    line.trim().length > 20 && 
    (line.includes(':') || line.match(/^[-•\d]/))
  );

  return lines.slice(0, 6); // Max 6 actions
}

/**
 * Calculate analysis metrics from risks
 */
export function calculateAnalysisMetrics(risks: any[]): {
  critical: number;
  highPriority: number;
  roamCoverage: number;
} {
  const critical = risks.filter(
    r => r.impactStrength === 'high' && r.probability === 'high'
  ).length;

  const highPriority = risks.filter(
    r => r.impactStrength === 'high'
  ).length;

  const withRoam = risks.filter(r => r.roaming).length;
  const roamCoverage = risks.length > 0 
    ? Math.round((withRoam / risks.length) * 100)
    : 0;

  return { critical, highPriority, roamCoverage };
}
