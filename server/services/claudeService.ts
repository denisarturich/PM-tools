import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT } from '../prompts/systemPrompt';

interface ClaudeConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
}

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class ClaudeService {
  private client: Anthropic;
  private config: ClaudeConfig;

  constructor(config: ClaudeConfig) {
    this.config = config;
    this.client = new Anthropic({
      apiKey: config.apiKey,
    });
  }

  /**
   * Send a message to Claude with conversation history
   */
  async sendMessage(
    message: string,
    history: ClaudeMessage[] = [],
    systemPromptAddition?: string
  ): Promise<string> {
    const messages: Anthropic.MessageParam[] = [
      ...history,
      {
        role: 'user',
        content: message,
      },
    ];

    const systemPrompt = systemPromptAddition 
      ? `${SYSTEM_PROMPT}\n\n${systemPromptAddition}`
      : SYSTEM_PROMPT;

    const response = await this.client.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      system: systemPrompt,
      messages,
    });

    // Extract text content from response
    const textContent = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as Anthropic.TextBlock).text)
      .join('\n');

    return textContent;
  }

  /**
   * Get token usage from last request (for monitoring)
   */
  async sendMessageWithUsage(
    message: string,
    history: ClaudeMessage[] = [],
    systemPromptAddition?: string
  ): Promise<{ text: string; usage: { inputTokens: number; outputTokens: number } }> {
    const messages: Anthropic.MessageParam[] = [
      ...history,
      {
        role: 'user',
        content: message,
      },
    ];

    const systemPrompt = systemPromptAddition 
      ? `${SYSTEM_PROMPT}\n\n${systemPromptAddition}`
      : SYSTEM_PROMPT;

    const response = await this.client.messages.create({
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      system: systemPrompt,
      messages,
    });

    const textContent = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as Anthropic.TextBlock).text)
      .join('\n');

    return {
      text: textContent,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    };
  }
}

// Singleton instance
let claudeServiceInstance: ClaudeService | null = null;

export function getClaudeService(): ClaudeService {
  if (!claudeServiceInstance) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables');
    }

    claudeServiceInstance = new ClaudeService({
      apiKey,
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
      maxTokens: parseInt(process.env.ANTHROPIC_MAX_TOKENS || '2000', 10),
    });
  }

  return claudeServiceInstance;
}
