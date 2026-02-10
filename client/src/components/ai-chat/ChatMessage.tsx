import { AIResponse, UserMessage, AIAction } from '@/types/ai';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: AIResponse | UserMessage;
  onAction?: (action: AIAction) => void;
}

export function ChatMessage({ message, onAction }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className="space-y-3">
      {/* Message bubble */}
      <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
        {/* Avatar */}
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground text-sm">🤖</span>
          </div>
        )}

        {/* Content */}
        <div className={cn("flex-1", isUser && "flex justify-end")}>
          <div
            className={cn(
              "rounded-lg p-3 max-w-[85%]",
              isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <p className="text-sm whitespace-pre-wrap">{
              isUser ? message.content : message.message
            }</p>
            <p className={cn(
              "text-xs mt-1",
              isUser ? "text-primary-foreground/70" : "text-muted-foreground"
            )}>
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons (только для AI messages) */}
      {!isUser && message.actions && message.actions.length > 0 && (
        <div className="ml-11 space-y-2">
          {message.actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'secondary'}
              className="w-full justify-start text-left"
              onClick={() => onAction?.(action)}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
