import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AIChatButtonProps {
  onClick: () => void;
  suggestionsCount?: number;
}

export function AIChatButton({ onClick, suggestionsCount }: AIChatButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onClick}
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <MessageCircle className="h-6 w-6" />
        {suggestionsCount !== undefined && suggestionsCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {suggestionsCount}
          </Badge>
        )}
      </Button>
    </div>
  );
}
