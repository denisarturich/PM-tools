export type AIActionType = 
  | 'add_risks'
  | 'update_risk'
  | 'add_mitigation'
  | 'analyze'
  | 'navigate'
  | 'confirm';

export interface AIAction {
  type: AIActionType;
  label: string;
  data: any;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  icon?: string; // emoji или lucide icon name
}

export interface AIResponse {
  role: 'assistant';
  message: string;
  data?: {
    risks?: Array<{
      task?: string;
      risk: string;
      impact?: string;
      impactStrength?: 'low' | 'medium' | 'high';
      probability?: 'low' | 'medium' | 'high';
    }>;
    mitigation?: {
      riskId: string;
      actions: string[];
    };
    analysis?: {
      critical: number;
      highPriority: number;
      roamCoverage: number;
      insights: string[];
    };
  };
  actions?: AIAction[];
  timestamp: Date;
}

export interface UserMessage {
  role: 'user';
  content: string;
  timestamp: Date;
}

export type ChatMessage = AIResponse | UserMessage;
