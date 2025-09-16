import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Expand } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptCardProps {
  id: string;
  title: string;
  summary: string;
  stage: string;
  tags: string[];
  fullText: string;
  onExpand: () => void;
}

const STAGE_LABELS: Record<string, string> = {
  initiation: "Initiation",
  planning: "Planning", 
  execution: "Execution",
  monitoring: "Monitoring",
  closing: "Closing"
};

const STAGE_COLORS: Record<string, string> = {
  initiation: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  planning: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  execution: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", 
  monitoring: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  closing: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
};

export default function PromptCard({
  id,
  title,
  summary,
  stage,
  tags,
  fullText,
  onExpand
}: PromptCardProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      toast({
        title: "Success!",
        description: "Prompt copied to clipboard",
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = fullText;
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

  return (
    <Card className="hover-elevate transition-all duration-200 flex flex-col min-h-[200px]" data-testid={`card-prompt-${id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight text-card-foreground">
            {title}
          </h3>
          <Badge 
            className={`shrink-0 ${STAGE_COLORS[stage] || 'bg-gray-100 text-gray-800'}`}
            data-testid={`badge-stage-${stage}`}
          >
            {STAGE_LABELS[stage] || stage}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        <p className="text-muted-foreground leading-relaxed text-sm">
          {summary}
        </p>
      </CardContent>

      <CardFooter className="pt-0 flex gap-2 mt-auto">
        <Button 
          size="sm" 
          variant="outline"
          onClick={handleCopy}
          className="flex items-center gap-2"
          data-testid={`button-copy-${id}`}
        >
          <Copy className="h-3 w-3" />
          Copy
        </Button>
        
        <Button 
          size="sm"
          onClick={onExpand}
          className="flex items-center gap-2"
          data-testid={`button-expand-${id}`}
        >
          <Expand className="h-3 w-3" />
          Expand
        </Button>
      </CardFooter>
    </Card>
  );
}