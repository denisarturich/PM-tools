import { AIResponse, UserMessage, AIAction } from '@/types/ai';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
            {isUser ? (
              // User messages: plain text
              <p className="text-sm whitespace-pre-wrap">
                {message.content}
              </p>
            ) : (
              // AI messages: markdown
              <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Paragraphs
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    // Lists
                    ul: ({ children }) => (
                      <ul className="ml-4 mb-2 last:mb-0 list-disc">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="ml-4 mb-2 last:mb-0 list-decimal">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="mb-1">{children}</li>
                    ),
                    // Code
                    code: ({ inline, children, ...props }: any) => {
                      return inline ? (
                        <code
                          className="bg-primary/10 px-1.5 py-0.5 rounded text-xs font-mono"
                          {...props}
                        >
                          {children}
                        </code>
                      ) : (
                        <code
                          className="block bg-primary/10 p-3 rounded text-xs font-mono overflow-x-auto"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                    pre: ({ children }) => (
                      <pre className="mb-2 last:mb-0 overflow-x-auto">{children}</pre>
                    ),
                    // Headings
                    h1: ({ children }) => (
                      <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-sm font-bold mb-2 mt-2 first:mt-0">{children}</h3>
                    ),
                    // Emphasis
                    strong: ({ children }) => (
                      <strong className="font-bold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    // Blockquote
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary/30 pl-3 my-2 italic">
                        {children}
                      </blockquote>
                    ),
                    // Tables
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-2">
                        <table className="min-w-full border border-border">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-muted">{children}</thead>
                    ),
                    th: ({ children }) => (
                      <th className="border border-border px-3 py-2 text-left font-semibold">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-border px-3 py-2">
                        {children}
                      </td>
                    ),
                    // Links
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    // Horizontal rule
                    hr: () => (
                      <hr className="my-3 border-border" />
                    ),
                  }}
                >
                  {message.message}
                </ReactMarkdown>
              </div>
            )}
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
