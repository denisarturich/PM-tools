import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Prompt } from "@shared/schema";

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt | null;
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

  // Body lock при открытом модале
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

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
      {/* ВАЖНО: убираем общий скролл, строим трёхзонный layout */}
      <DialogContent className="p-0 overflow-hidden sm:max-w-4xl" data-testid="modal-prompt">
        <div className="flex max-h-[85vh] flex-col">
          {/* Header — не скроллится */}
          <div className="px-6 pt-6 pb-4 border-b">
            <DialogHeader className="space-y-2">
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
          </div>

          {/* Body — СКРОЛЛИМ ТОЛЬКО ЭТО */}
          <div
            className="min-h-0 flex-1 overflow-y-auto px-6 py-4"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="bg-muted/50 rounded-md p-4 min-h-[200px] mb-4">
              <pre className="font-mono text-sm whitespace-pre-wrap break-words leading-relaxed max-w-full">
                {prompt.fullText}
              </pre>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={handleCopy}
                className="flex items-center gap-2"
                size="sm"
                data-testid="button-copy-modal"
              >
                <Copy className="h-3 w-3" />
                Скопировать
              </Button>
            </div>
          </div>

          {/* Footer — не скроллится */}
          <div className="px-6 py-4 border-t">
            <div className="text-xs text-muted-foreground text-center">
              Нажмите Esc для закрытия или Ctrl+C для копирования
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}