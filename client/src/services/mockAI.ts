import { AIResponse } from '@/types/ai';
import { Risk } from '@/pages/RiskManagement';

// Симуляция задержки API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAIService = {
  /**
   * Generate risks для проекта
   */
  generateRisks: async (projectDescription: string): Promise<AIResponse> => {
    await delay(1500); // Симуляция обработки

    const mockRisks = [
      {
        task: 'Mobile app release',
        risk: 'App Store rejection due to unclear privacy policy',
        impact: 'Release delayed by 2 weeks, miss Q1 marketing window',
        impactStrength: 'high' as const,
        probability: 'medium' as const,
      },
      {
        task: 'Database migration',
        risk: 'Migration script fails on production due to data inconsistencies',
        impact: 'Service downtime for 2-4 hours, potential data loss',
        impactStrength: 'high' as const,
        probability: 'low' as const,
      },
      {
        task: 'Payment integration',
        risk: 'Payment gateway API experiences downtime during peak hours',
        impact: 'Users unable to checkout, revenue loss ~$500/hour',
        impactStrength: 'high' as const,
        probability: 'medium' as const,
      },
      {
        task: 'User authentication',
        risk: 'OAuth provider rate limiting during traffic spikes',
        impact: 'Users cannot log in, support tickets increase',
        impactStrength: 'medium' as const,
        probability: 'medium' as const,
      },
      {
        task: 'Push notifications',
        risk: 'Notification service delays causing poor user experience',
        impact: 'Reduced engagement, user complaints',
        impactStrength: 'medium' as const,
        probability: 'low' as const,
      },
      {
        task: 'Content delivery',
        risk: 'CDN failure in specific regions',
        impact: 'Slow load times for affected users',
        impactStrength: 'low' as const,
        probability: 'low' as const,
      },
    ];

    return {
      role: 'assistant',
      message: `I found ${mockRisks.length} typical risks for your project:\n\n🔴 High Priority (3):\n• App Store rejection\n• Database migration failure\n• Payment gateway downtime\n\n🟡 Medium Priority (2):\n• OAuth rate limiting\n• Notification delays\n\n🟢 Low Priority (1):\n• CDN failure`,
      data: {
        risks: mockRisks,
      },
      actions: [
        {
          type: 'add_risks',
          label: `✅ Add all ${mockRisks.length} risks to table`,
          data: { mode: 'all' },
          variant: 'default',
          icon: '✅',
        },
        // TODO: Add "Let me pick" feature
        // When implemented, this button will show checkboxes for each risk
        // allowing user to select specific risks to add
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
      ],
      timestamp: new Date(),
    };
  },

  /**
   * Analyze существующие риски
   */
  analyzeRisks: async (risks: Risk[]): Promise<AIResponse> => {
    await delay(2000);

    const highHigh = risks.filter(
      r => r.impactStrength === 'high' && r.probability === 'high'
    ).length;

    const unprocessed = risks.filter(r => !r.roaming).length;
    const roamCoverage = risks.length > 0 ? Math.round(((risks.length - unprocessed) / risks.length) * 100) : 0;

    return {
      role: 'assistant',
      message: `📊 Analysis Complete\n\nI analyzed your ${risks.length} risks:\n\n🔴 Critical Issues (${highHigh}):\n${highHigh > 0 ? '• You have High/High risks without mitigation\n• Immediate attention required' : '• No critical issues found'}\n\n⚠️ Concerns:\n• ${unprocessed} risks have no ROAM status\n• ROAM coverage: ${roamCoverage}%\n\n💡 Recommendation:\n${highHigh > 0 ? 'Focus on your High/High risks first—they need mitigation plans.' : 'Good job! Continue processing unassigned risks.'}`,
      data: {
        analysis: {
          critical: highHigh,
          highPriority: risks.filter(r => r.impactStrength === 'high').length,
          roamCoverage,
          insights: [
            `${highHigh} High/High risks`,
            `${unprocessed} unprocessed risks`,
            `${roamCoverage}% ROAM coverage`,
          ],
        },
      },
      actions: [
        ...(highHigh > 0 ? [{
          type: 'navigate' as const,
          label: '💡 Suggest mitigation for critical risks',
          data: { action: 'mitigate_critical' },
          variant: 'default' as const,
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
      ],
      timestamp: new Date(),
    };
  },

  /**
   * Suggest mitigation для конкретного риска
   */
  suggestMitigation: async (risk: Risk): Promise<AIResponse> => {
    await delay(1500);

    const mitigationActions = [
      'Implement comprehensive error handling and retry logic',
      'Set up monitoring and alerting for early detection',
      'Create detailed rollback procedures',
      'Establish clear communication protocols with stakeholders',
      'Assign dedicated owner for monitoring',
    ];

    return {
      role: 'assistant',
      message: `💡 Mitigation Plan for "${risk.risk}"\n\n🛡️ Prevention:\n• Test thoroughly in staging environment\n• Review with technical lead before deployment\n\n🔄 Backup Plans:\n• ${mitigationActions[0]}\n• ${mitigationActions[1]}\n\n📊 Monitoring:\n• ${mitigationActions[2]}\n• ${mitigationActions[4]}`,
      data: {
        mitigation: {
          riskId: risk.id,
          actions: mitigationActions,
        },
      },
      actions: [
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
      ],
      timestamp: new Date(),
    };
  },

  /**
   * Free-form chat response
   */
  chat: async (message: string, context: { risks: Risk[] }): Promise<AIResponse> => {
    await delay(1000);

    const lowerMsg = message.toLowerCase();

    // Check for numbers (user trying to select risks)
    if (/^\d[\d,\s]+$/.test(message.trim())) {
      return {
        role: 'assistant',
        message: `I see you're trying to select risks by number.\n\n⚠️ Individual risk selection is coming soon!\n\nFor now, you can either:\n• Add all generated risks at once\n• Ask me to generate a different set`,
        actions: [
          {
            type: 'navigate',
            label: '🔄 Generate different risks',
            data: { action: 'regenerate' },
            variant: 'default',
            icon: '🔄',
          },
          {
            type: 'navigate',
            label: '🏠 Back to menu',
            data: { view: 'welcome' },
            variant: 'outline',
            icon: '🏠',
          },
        ],
        timestamp: new Date(),
      };
    }

    // Help
    if (lowerMsg.includes('help') || lowerMsg.includes('what can you do')) {
      return {
        role: 'assistant',
        message: `I can help you with:\n\n✨ Generate Risks - Create risk list for your project\n🔍 Analyze Risks - Review and get recommendations\n💡 Suggest Mitigation - Get action plans\n\nWhat would you like to do?`,
        actions: [
          {
            type: 'navigate',
            label: '✨ Generate risks',
            data: { view: 'generate' },
            variant: 'default',
            icon: '✨',
          },
          {
            type: 'navigate',
            label: '🔍 Analyze risks',
            data: { view: 'analyze' },
            variant: 'secondary',
            icon: '🔍',
          },
          {
            type: 'navigate',
            label: '💡 Suggest mitigation',
            data: { view: 'mitigate' },
            variant: 'secondary',
            icon: '💡',
          },
        ],
        timestamp: new Date(),
      };
    }

    // Biggest risk
    if (lowerMsg.includes('biggest risk') || lowerMsg.includes('most critical')) {
      const highRisks = context.risks.filter(
        r => r.impactStrength === 'high' && r.probability === 'high'
      );

      if (highRisks.length > 0) {
        return {
          role: 'assistant',
          message: `Your biggest risk is: "${highRisks[0].risk}"\n\nIt's rated High/High and ${highRisks[0].roaming ? `status: ${highRisks[0].roaming}` : 'has no ROAM status yet'}.\n\nWant me to suggest mitigation?`,
          actions: [
            {
              type: 'navigate',
              label: '💡 Yes, suggest mitigation',
              data: { action: 'mitigate', riskId: highRisks[0].id },
              variant: 'default',
              icon: '💡',
            },
            {
              type: 'navigate',
              label: '🔍 Analyze all risks',
              data: { view: 'analyze' },
              variant: 'secondary',
              icon: '🔍',
            },
            {
              type: 'navigate',
              label: '🏠 Back to menu',
              data: { view: 'welcome' },
              variant: 'outline',
              icon: '🏠',
            },
          ],
          timestamp: new Date(),
        };
      } else {
        return {
          role: 'assistant',
          message: `${context.risks.length > 0 ? 'You don\'t have any High/High risks yet. Good job!' : 'You don\'t have any risks yet.'}\n\nWhat would you like to do?`,
          actions: context.risks.length === 0 ? [
            {
              type: 'navigate',
              label: '✨ Generate risks',
              data: { view: 'generate' },
              variant: 'default',
              icon: '✨',
            },
            {
              type: 'navigate',
              label: '🏠 Back to menu',
              data: { view: 'welcome' },
              variant: 'outline',
              icon: '🏠',
            },
          ] : [
            {
              type: 'navigate',
              label: '🔍 Analyze all risks',
              data: { view: 'analyze' },
              variant: 'default',
              icon: '🔍',
            },
            {
              type: 'navigate',
              label: '🏠 Back to menu',
              data: { view: 'welcome' },
              variant: 'outline',
              icon: '🏠',
            },
          ],
          timestamp: new Date(),
        };
      }
    }

    // Default response
    return {
      role: 'assistant',
      message: `I'm not sure how to help with: "${message}"\n\nTry asking:\n• "What's my biggest risk?"\n• "Help"\n• Or describe your project to generate risks`,
      actions: [
        {
          type: 'navigate',
          label: '❓ Show help',
          data: { action: 'help' },
          variant: 'default',
          icon: '❓',
        },
        {
          type: 'navigate',
          label: '🏠 Back to menu',
          data: { view: 'welcome' },
          variant: 'outline',
          icon: '🏠',
        },
      ],
      timestamp: new Date(),
    };
  },
};
