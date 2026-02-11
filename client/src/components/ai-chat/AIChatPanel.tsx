import { X, Send, Sparkles, Search, Lightbulb, Trash2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useEffect, useRef } from 'react';

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  onQuickAction: (action: 'generate' | 'analyze' | 'mitigate') => void;
  onClearHistory: () => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  messagesCount: number;
  children: React.ReactNode;
}

export function AIChatPanel({ 
  isOpen, 
  onClose, 
  onSendMessage,
  onQuickAction,
  onClearHistory,
  inputValue,
  onInputChange,
  messagesCount,
  children 
}: AIChatPanelProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or dialog opens
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      // Use scrollIntoView for more reliable scrolling
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [children, isOpen, messagesCount]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
    }
  };

  return (
    <>
      {/* Backdrop - только на мобильном */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Desktop: Fixed Panel */}
      <div className="hidden md:block">
        <Card className="fixed top-20 right-6 w-96 h-[600px] z-50 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0 bg-background">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold">AI Risk Assistant</h3>
                <p className="text-xs text-muted-foreground">Continuous conversation</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Actions Bar */}
          <div className="sticky top-0 z-10 bg-background border-b p-3 flex-shrink-0">
            <div className="flex gap-2 items-center flex-wrap">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onQuickAction('generate')}
                className="flex-1 min-w-0"
              >
                <Sparkles className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">Generate</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onQuickAction('analyze')}
                className="flex-1 min-w-0"
              >
                <Search className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">Analyze</span>
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onQuickAction('mitigate')}
                className="flex-1 min-w-0"
              >
                <Lightbulb className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">Mitigate</span>
              </Button>
              
              {/* Кнопка очистки истории */}
              <Button 
                size="sm" 
                variant="ghost"
                onClick={onClearHistory}
                disabled={messagesCount === 0}
                title="Clear chat history"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            {messagesCount === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium mb-1">Welcome! 👋</p>
                <p className="text-xs">Choose an action above to start</p>
              </div>
            ) : (
              <div className="space-y-4">
                {children}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Footer with Input */}
          <div className="border-t p-4 flex-shrink-0 bg-background">
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <Input 
                placeholder="Ask me anything..."
                className="flex-1"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
              />
              <Button type="submit" size="icon" disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </div>

      {/* Mobile: Full Screen Panel */}
      <Card className="md:hidden fixed top-0 right-0 h-full w-full z-50 rounded-none flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold">AI Risk Assistant</h3>
              <p className="text-xs text-muted-foreground">Continuous conversation</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Actions Bar */}
        <div className="sticky top-0 z-10 bg-background border-b p-3 flex-shrink-0">
          <div className="flex gap-2 items-center mb-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onQuickAction('generate')}
              className="flex-1"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Generate
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onQuickAction('analyze')}
              className="flex-1"
            >
              <Search className="w-4 h-4 mr-1" />
              Analyze
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onQuickAction('mitigate')}
              className="flex-1"
            >
              <Lightbulb className="w-4 h-4 mr-1" />
              Mitigate
            </Button>
          </div>
          <div className="flex justify-end">
            <Button 
              size="sm" 
              variant="ghost"
              onClick={onClearHistory}
              disabled={messagesCount === 0}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear history
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          {messagesCount === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-8">
              <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium mb-1">Welcome! 👋</p>
              <p className="text-xs">Choose an action above to start</p>
            </div>
          ) : (
            <div className="space-y-4">
              {children}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Footer with Input */}
        <div className="border-t p-4 flex-shrink-0 bg-background">
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <Input 
              placeholder="Ask me anything..."
              className="flex-1"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
            />
            <Button type="submit" size="icon" disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </>
  );
}
