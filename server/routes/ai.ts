import { Router } from 'express';
import { getClaudeService } from '../services/claudeService';
import { RISK_GENERATION_PROMPT } from '../prompts/riskGeneration';
import { RISK_ANALYSIS_PROMPT } from '../prompts/riskAnalysis';
import { MITIGATION_PROMPT } from '../prompts/mitigation';
import {
  extractJSON,
  extractTextAfterJSON,
  extractMitigationActions,
  calculateAnalysisMetrics,
} from '../utils/responseParser';
import { aiFeatureGuard } from '../middleware/aiFeatureGuard';

const router = Router();

// Apply feature guard to all AI routes
router.use(aiFeatureGuard);

/**
 * POST /api/ai/chat
 * Free-form chat endpoint
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, history = [], context = {} } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required',
      });
    }

    const claudeService = getClaudeService();

    // Add context to message if provided
    let enhancedMessage = message;
    if (context.risks && context.risks.length > 0) {
      enhancedMessage = `Context: I have ${context.risks.length} risks in my project.\n\nQuestion: ${message}`;
    }

    const response = await claudeService.sendMessageWithUsage(
      enhancedMessage,
      history
    );

    // Determine suggested actions based on response
    const actions = generateChatActions(response.text, context);

    res.json({
      success: true,
      data: {
        role: 'assistant',
        message: response.text,
        actions,
        usage: response.usage,
        timestamp: new Date(),
      },
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    
    if (error.status === 401) {
      return res.status(500).json({
        error: 'Invalid API key',
        message: 'Please check ANTHROPIC_API_KEY configuration',
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Please try again in a moment',
      });
    }

    res.status(500).json({
      error: 'Failed to process chat message',
      message: error.message,
    });
  }
});

/**
 * POST /api/ai/generate-risks
 * Generate risks for a project
 */
router.post('/generate-risks', async (req, res) => {
  try {
    const { projectDescription } = req.body;

    if (!projectDescription) {
      return res.status(400).json({
        error: 'Project description is required',
      });
    }

    const claudeService = getClaudeService();
    const prompt = RISK_GENERATION_PROMPT(projectDescription);

    const response = await claudeService.sendMessageWithUsage(prompt);

    // Extract risks from response
    const risks = extractJSON(response.text);
    const summary = extractTextAfterJSON(response.text) || response.text;

    // Generate action buttons
    const actions = [
      {
        type: 'add_risks',
        label: `✅ Add all ${risks.length} risks to table`,
        data: { mode: 'all' },
        variant: 'default',
        icon: '✅',
      },
      {
        type: 'add_risks',
        label: '📝 Let me pick which ones',
        data: { mode: 'select' },
        variant: 'secondary',
        icon: '📝',
      },
      {
        type: 'navigate',
        label: '🔄 Generate different risks',
        data: { action: 'regenerate' },
        variant: 'outline',
        icon: '🔄',
      },
      {
        type: 'navigate',
        label: '🏠 Back to menu',
        data: { view: 'welcome' },
        variant: 'outline',
        icon: '🏠',
      },
    ];

    res.json({
      success: true,
      data: {
        role: 'assistant',
        message: summary,
        data: { risks },
        actions,
        usage: response.usage,
        timestamp: new Date(),
      },
    });
  } catch (error: any) {
    console.error('Risk generation error:', error);
    res.status(500).json({
      error: 'Failed to generate risks',
      message: error.message,
    });
  }
});

/**
 * POST /api/ai/analyze-risks
 * Analyze existing risks
 */
router.post('/analyze-risks', async (req, res) => {
  try {
    const { risks } = req.body;

    if (!Array.isArray(risks) || risks.length === 0) {
      return res.status(400).json({
        error: 'Risks array is required',
      });
    }

    const claudeService = getClaudeService();
    const prompt = RISK_ANALYSIS_PROMPT(risks);

    const response = await claudeService.sendMessageWithUsage(prompt);

    // Calculate metrics
    const metrics = calculateAnalysisMetrics(risks);

    // Generate actions
    const actions = [
      ...(metrics.critical > 0 ? [{
        type: 'navigate',
        label: '💡 Suggest mitigation for critical risks',
        data: { action: 'mitigate_critical' },
        variant: 'default',
        icon: '💡',
      }] : []),
      {
        type: 'navigate',
        label: '📊 View detailed report',
        data: { action: 'detailed_report' },
        variant: 'secondary',
        icon: '📊',
      },
      {
        type: 'navigate',
        label: '🏠 Back to menu',
        data: { view: 'welcome' },
        variant: 'outline',
        icon: '🏠',
      },
    ];

    res.json({
      success: true,
      data: {
        role: 'assistant',
        message: response.text,
        data: {
          analysis: {
            ...metrics,
            insights: extractInsights(response.text),
          },
        },
        actions,
        usage: response.usage,
        timestamp: new Date(),
      },
    });
  } catch (error: any) {
    console.error('Risk analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze risks',
      message: error.message,
    });
  }
});

/**
 * POST /api/ai/suggest-mitigation
 * Suggest mitigation for a specific risk
 */
router.post('/suggest-mitigation', async (req, res) => {
  try {
    const { risk } = req.body;

    if (!risk || !risk.risk) {
      return res.status(400).json({
        error: 'Risk object is required',
      });
    }

    const claudeService = getClaudeService();
    const prompt = MITIGATION_PROMPT(risk);

    const response = await claudeService.sendMessageWithUsage(prompt);

    // Extract mitigation actions
    const mitigationActions = extractMitigationActions(response.text);

    // Generate actions
    const actions = [
      {
        type: 'add_mitigation',
        label: '✅ Add all suggestions to Actions',
        data: { riskId: risk.id, actions: mitigationActions },
        variant: 'default',
        icon: '✅',
      },
      {
        type: 'add_mitigation',
        label: '✏️ Let me customize',
        data: { riskId: risk.id, mode: 'custom' },
        variant: 'secondary',
        icon: '✏️',
      },
      {
        type: 'navigate',
        label: '➡️ Suggest for another risk',
        data: { action: 'mitigate_next' },
        variant: 'outline',
        icon: '➡️',
      },
      {
        type: 'navigate',
        label: '🏠 Back to menu',
        data: { view: 'welcome' },
        variant: 'outline',
        icon: '🏠',
      },
    ];

    res.json({
      success: true,
      data: {
        role: 'assistant',
        message: response.text,
        data: {
          mitigation: {
            riskId: risk.id,
            actions: mitigationActions,
          },
        },
        actions,
        usage: response.usage,
        timestamp: new Date(),
      },
    });
  } catch (error: any) {
    console.error('Mitigation suggestion error:', error);
    res.status(500).json({
      error: 'Failed to suggest mitigation',
      message: error.message,
    });
  }
});

// ============================================================
// Helper Functions
// ============================================================

function generateChatActions(response: string, context: any): any[] {
  const actions = [];

  // Check if response suggests specific actions
  if (response.toLowerCase().includes('generate') || response.toLowerCase().includes('create risk')) {
    actions.push({
      type: 'navigate',
      label: '✨ Generate risks',
      data: { view: 'generate' },
      variant: 'default',
    });
  }

  if (response.toLowerCase().includes('analyze') && context.risks?.length > 0) {
    actions.push({
      type: 'navigate',
      label: '🔍 Analyze risks',
      data: { view: 'analyze' },
      variant: 'secondary',
    });
  }

  if (response.toLowerCase().includes('mitigat') && context.risks?.length > 0) {
    actions.push({
      type: 'navigate',
      label: '💡 Suggest mitigation',
      data: { view: 'mitigate' },
      variant: 'secondary',
    });
  }

  // Always add back to menu
  actions.push({
    type: 'navigate',
    label: '🏠 Back to menu',
    data: { view: 'welcome' },
    variant: 'outline',
  });

  return actions;
}

function extractInsights(text: string): string[] {
  const insights: string[] = [];
  
  // Try to find numbered insights
  const regex = /(?:^|\n)\d+\.\s*\*\*([^*\n]+)\*\*:?\s*([^\n]+)/g;
  const matches = Array.from(text.matchAll(regex));
  for (const match of matches) {
    insights.push(`${match[1]}: ${match[2]}`);
  }

  // Limit to top 5
  return insights.slice(0, 5);
}

export default router;
