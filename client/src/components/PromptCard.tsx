import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Expand } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StageDetails {
  name: string;
  priority: number;
  color: string;
}

interface PromptCardProps {
  id: string;
  title: string;
  summary: string;
  stage: string;
  stageDetails?: StageDetails | null;
  tags: string[];
  fullText: string;
  onExpand: () => void;
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

export default function PromptCard({
  id,
  title,
  summary,
  stage,
  stageDetails,
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
            className={`shrink-0 ${stageDetails?.color ? getStageColorClasses(stageDetails.color) : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'}`}
            data-testid={`badge-stage-${stage}`}
          >
            {stageDetails?.name || stage}
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