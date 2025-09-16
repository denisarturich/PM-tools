import { Button } from "@/components/ui/button";
import { ExternalLink, LinkedinIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onSuggestPrompt?: () => void;
}

export default function Header({ onSuggestPrompt }: HeaderProps) {
  const { toast } = useToast();
  const linkedinUrl = "https://www.linkedin.com/in/nikden";
  const fallbackEmail = "dnicolaev92@gmail.com";

  const handleSuggestPrompt = () => {
    // Показываем toast с вариантом написать на почту
    toast({
      title: "Contact me",
      description: "If LinkedIn doesn't open or is unavailable, send an email",
      action: (
        <Button
          size="sm"
          onClick={() => {
            window.open(`mailto:${fallbackEmail}?subject=Prompt%20Suggestion&body=Hi!%20I%20want%20to%20suggest%20a%20prompt%20for%20the%20directory.`, '_blank');
          }}
        >
          Send Email
        </Button>
      ),
    });
    
    onSuggestPrompt?.();
  };

  return (
    <header className="px-4 pt-6 pb-6 border-b bg-card">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground">
              Prompt Directory for Project Managers
            </h1>
            <p className="text-xs text-muted-foreground">
              Ready-made prompt templates for any project stage
            </p>
          </div>
          
          <Button 
            asChild
            size="sm"
            className="flex items-center gap-2"
            data-testid="button-suggest-prompt"
            title="Contact via LinkedIn or email: dnicolaev92@gmail.com"
          >
            <a 
              href={linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleSuggestPrompt}
            >
              Suggest a Prompt
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}