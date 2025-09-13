import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: {
    title: string;
    summary: string;
    fullText: string;
    stage: string;
    tags: string[];
  } | null;
}

const STAGE_LABELS: Record<string, string> = {
  discovery: "Discovery",
  planning: "Планирование",
  execution: "Выполнение", 
  monitoring: "Мониторинг",
  closing: "Закрытие"
};

export default function PromptModal({ isOpen, onClose, prompt }: PromptModalProps) {
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && isOpen && prompt) {
        handleCopy();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, prompt]);

  const handleCopy = async () => {
    if (!prompt) return;
    
    try {
      await navigator.clipboard.writeText(prompt.fullText);
      toast({
        title: "Успешно!",
        description: "Промпт скопирован в буфер обмена",
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = prompt.fullText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Успешно!",
        description: "Промпт скопирован в буфер обмена",
      });
    }
  };

  if (!prompt) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col" data-testid="modal-prompt">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold mb-2">
                {prompt.title}
              </DialogTitle>
              <DialogDescription className="text-base">
                {prompt.summary}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary">
                {STAGE_LABELS[prompt.stage] || prompt.stage}
              </Badge>
              <Button 
                size="icon"
                variant="ghost"
                onClick={onClose}
                data-testid="button-close-modal"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {prompt.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="relative h-full">
            <pre className="font-mono text-sm bg-muted/50 p-4 rounded-md h-full overflow-auto whitespace-pre-wrap leading-relaxed">
              {prompt.fullText}
            </pre>
            <Button
              onClick={handleCopy}
              className="absolute top-2 right-2 flex items-center gap-2"
              size="sm"
              data-testid="button-copy-modal"
            >
              <Copy className="h-3 w-3" />
              Скопировать
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center mt-4">
          Нажмите Esc для закрытия или Ctrl+C для копирования
        </div>
      </DialogContent>
    </Dialog>
  );
}