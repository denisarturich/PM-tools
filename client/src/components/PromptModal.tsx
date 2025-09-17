import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StageDetails {
  name: string;
  priority: number;
  color: string;
}

interface PromptWithStageDetails {
  id: string;
  title: string;
  slug: string;
  summary: string;
  stage: string;
  stageDetails?: StageDetails | null;
  fullText: string;
  authorName?: string | null;
  authorUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: PromptWithStageDetails | null;
}

// Helper function to convert color name to Tailwind classes
const getStageColorClasses = (color: string): string => {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    orange: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    pink: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  };
  return colorMap[color] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
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
        title: "Success!",
        description: "Prompt copied to clipboard",
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
        title: "Success!",
        description: "Prompt copied to clipboard",
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
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Badge 
                  className={`w-fit ${prompt.stageDetails?.color ? getStageColorClasses(prompt.stageDetails.color) : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}
                >
                  {prompt.stageDetails?.name || prompt.stage}
                </Badge>
                {/* Блок автора на одном уровне с этапом */}
                {prompt.authorName?.trim() && (
                  <div className="ml-auto text-sm text-muted-foreground flex items-center space-x-1" data-testid="text-author">
                    <span className="font-semibold">Author:</span>
                    {prompt.authorUrl?.trim() ? (
                      <a
                        href={prompt.authorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Author's page"
                        title="Open author's page"
                        className="hover:underline hover:text-foreground transition-colors"
                        data-testid="link-author"
                      >
                        {prompt.authorName}
                      </a>
                    ) : (
                      <span>{prompt.authorName}</span>
                    )}
                  </div>
                )}
              </div>
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
                Copy
              </Button>
            </div>
          </div>

          {/* Footer — не скроллится */}
          <div className="px-6 py-4 border-t">
            <div className="text-xs text-muted-foreground text-center">
              Press Esc to close or Ctrl+C to copy
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}