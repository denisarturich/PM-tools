import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  children: React.ReactNode;
}

export function AIChatPanel({ 
  isOpen, 
  onClose, 
  onSendMessage,
  inputValue,
  onInputChange,
  children 
}: AIChatPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - только на мобильном */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Desktop: Fixed Panel (без drag/resize пока) */}
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
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            {children}
          </ScrollArea>

          {/* Footer with Input */}
          <div className="border-t p-4 flex-shrink-0 bg-background">
            <form 
              className="flex gap-2" 
              onSubmit={(e) => {
                e.preventDefault();
                onSendMessage(inputValue);
              }}
            >
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

      {/* Mobile: Full Screen Panel (no drag/resize) */}
      <Card className="md:hidden fixed top-0 right-0 h-full w-full z-50 rounded-none flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold">AI Risk Assistant</h3>
              <p className="text-xs text-muted-foreground">Always here to help</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-4">
          {children}
        </ScrollArea>

        {/* Footer with Input */}
        <div className="border-t p-4 flex-shrink-0 bg-background">
          <form 
            className="flex gap-2" 
            onSubmit={(e) => {
              e.preventDefault();
              onSendMessage(inputValue);
            }}
          >
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
