import { Button } from "@/components/ui/button";
import { ExternalLink, LinkedinIcon } from "lucide-react";

interface HeaderProps {
  onSuggestPrompt?: () => void;
}

export default function Header({ onSuggestPrompt }: HeaderProps) {
  const linkedinUrl = import.meta.env.VITE_LINKEDIN_URL || "";
  const fallbackEmail = import.meta.env.VITE_FALLBACK_EMAIL || "support@example.com";

  const handleSuggestPrompt = () => {
    if (linkedinUrl) {
      window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open(`mailto:${fallbackEmail}?subject=Предложение%20промпта`, '_blank');
    }
    onSuggestPrompt?.();
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-3">
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
            onClick={handleSuggestPrompt}
            size="sm"
            className="flex items-center gap-2"
            data-testid="button-suggest-prompt"
            title="Добавьте меня в друзья на LinkedIn и пришлите ваш вариант"
          >
            {linkedinUrl ? (
              <LinkedinIcon className="h-4 w-4" />
            ) : (
              <ExternalLink className="h-4 w-4" />
            )}
            Предложить промпт
          </Button>
        </div>
      </div>
    </header>
  );
}