import { AIResponse } from '@/types/ai';
import { Risk } from '@/pages/RiskManagement';
import { mockAIService } from './mockAI';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

class AIService {
  private conversationHistory: ConversationMessage[] = [];
  private useMock: boolean = true; // Default to mock

  constructor() {
    // Check if we should use mock from environment
    const envUseMock = import.meta.env.VITE_USE_MOCK_AI;
    if (envUseMock !== undefined) {
      this.useMock = envUseMock === 'true';
    }
  }

  /**
   * Set whether to use mock AI (false = use real Claude API)
   */
  setUseMock(useMock: boolean) {
    this.useMock = useMock;
    console.log('🤖 AI Service mode:', useMock ? 'MOCK' : 'REAL Claude API');
  }

  /**
   * Check if currently using mock
   */
  isUsingMock(): boolean {
    return this.useMock;
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Restore conversation history from saved messages
   */
  restoreHistory(messages: any[]) {
    this.conversationHistory = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(msg => ({
        role: msg.role,
        content: msg.role === 'user' ? msg.content : msg.message,
      }));
    
    // Keep only last 10 messages to avoid token limits
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10);
    }
  }

  /**
   * Add message to history
   */
  private addToHistory(role: 'user' | 'assistant', content: string) {
    this.conversationHistory.push({ role, content });
    
    // Keep only last 10 messages to avoid token limits
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10);
    }
  }

  /**
   * Generate risks for a project
   */
  async generateRisks(projectDescription: string): Promise<AIResponse> {
    if (this.useMock) {
      return mockAIService.generateRisks(projectDescription);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/generate-risks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectDescription }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('AI feature is disabled');
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate risks');
      }

      this.addToHistory('user', projectDescription);
      this.addToHistory('assistant', result.data.message);

      return result.data;
    } catch (error: any) {
      console.error('AI Service Error:', error);
      
      // Fallback to mock on error
      console.warn('Falling back to mock AI service');
      return mockAIService.generateRisks(projectDescription);
    }
  }

  /**
   * Analyze existing risks
   */
  async analyzeRisks(risks: Risk[]): Promise<AIResponse> {
    if (this.useMock) {
      return mockAIService.analyzeRisks(risks);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/analyze-risks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ risks }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('AI feature is disabled');
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to analyze risks');
      }

      this.addToHistory('assistant', result.data.message);

      return result.data;
    } catch (error: any) {
      console.error('AI Service Error:', error);
      console.warn('Falling back to mock AI service');
      return mockAIService.analyzeRisks(risks);
    }
  }

  /**
   * Suggest mitigation for a specific risk
   */
  async suggestMitigation(risk: Risk): Promise<AIResponse> {
    if (this.useMock) {
      return mockAIService.suggestMitigation(risk);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/suggest-mitigation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ risk }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('AI feature is disabled');
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to suggest mitigation');
      }

      this.addToHistory('assistant', result.data.message);

      return result.data;
    } catch (error: any) {
      console.error('AI Service Error:', error);
      console.warn('Falling back to mock AI service');
      return mockAIService.suggestMitigation(risk);
    }
  }

  /**
   * Free-form chat
   */
  async chat(message: string, context: { risks: Risk[] }): Promise<AIResponse> {
    if (this.useMock) {
      return mockAIService.chat(message, context);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history: this.conversationHistory,
          context,
        }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('AI feature is disabled');
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to process chat');
      }

      this.addToHistory('user', message);
      this.addToHistory('assistant', result.data.message);

      return result.data;
    } catch (error: any) {
      console.error('AI Service Error:', error);
      console.warn('Falling back to mock AI service');
      return mockAIService.chat(message, context);
    }
  }
}

// Export singleton instance
export const aiService = new AIService();
