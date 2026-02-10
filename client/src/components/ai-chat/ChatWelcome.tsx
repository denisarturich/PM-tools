import { Sparkles, Search, Lightbulb } from 'lucide-react';
import { QuickActionButton } from './QuickActionButton';

interface ChatWelcomeProps {
  onSelectAction: (action: 'generate' | 'analyze' | 'mitigate') => void;
}

export function ChatWelcome({ onSelectAction }: ChatWelcomeProps) {
  return (
    <div className="space-y-4">
      {/* AI Welcome Message */}
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground text-sm">🤖</span>
        </div>
        <div className="flex-1">
          <p className="text-sm mb-4">
            Hi! I can help you with:
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2 ml-11">
        <QuickActionButton
          icon={<Sparkles className="h-4 w-4" />}
          title="Generate Risks"
          description="Create risk list for your project"
          onClick={() => onSelectAction('generate')}
        />

        <QuickActionButton
          icon={<Search className="h-4 w-4" />}
          title="Analyze Risks"
          description="Review current risks and get recommendations"
          onClick={() => onSelectAction('analyze')}
        />

        <QuickActionButton
          icon={<Lightbulb className="h-4 w-4" />}
          title="Suggest Mitigation"
          description="Get action plans to reduce risk impact"
          onClick={() => onSelectAction('mitigate')}
        />
      </div>

      {/* Free text option */}
      <div className="ml-11 pt-2 border-t">
        <p className="text-xs text-muted-foreground">
          Or just type your question below ↓
        </p>
      </div>
    </div>
  );
}
