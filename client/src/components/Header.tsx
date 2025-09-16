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
      title: "Связь со мной",
      description: "Если LinkedIn не открылся или недоступен, напишите на почту",
      action: (
        <Button
          size="sm"
          onClick={() => {
            window.open(`mailto:${fallbackEmail}?subject=Предложение%20промпта&body=Привет!%20Хочу%20предложить%20промпт%20для%20справочника.`, '_blank');
          }}
        >
          Написать на почту
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
              Справочник промптов для менеджеров проектов
            </h1>
            <p className="text-xs text-muted-foreground">
              Готовые шаблоны промптов для любых этапов проекта
            </p>
          </div>
          
          <Button 
            asChild
            size="sm"
            className="flex items-center gap-2"
            data-testid="button-suggest-prompt"
            title="Связаться через LinkedIn или по почте: dnicolaev92@gmail.com"
          >
            <a 
              href={linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={handleSuggestPrompt}
            >
              Предложить промпт
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}