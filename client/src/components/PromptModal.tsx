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
  initiation: "Инициация",
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
        <DialogHeader className="flex-shrink-0 space-y-3 pb-4">
          <div className="pr-10">
            <DialogTitle className="text-xl font-semibold">
              {prompt.title}
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              {prompt.summary}
            </DialogDescription>
          </div>
          <Badge className="bg-primary/10 text-primary w-fit">
            {STAGE_LABELS[prompt.stage] || prompt.stage}
          </Badge>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <div className="relative h-full">
            <div className="h-full overflow-y-auto bg-muted/50 rounded-md p-4">
              <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed pr-16">
                {prompt.fullText}
              </pre>
            </div>
            <Button
              onClick={handleCopy}
              className="absolute top-2 right-2 flex items-center gap-2 z-10"
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