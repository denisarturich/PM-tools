import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const STAGES = [
  { value: "all", label: "Все этапы" },
  { value: "discovery", label: "Discovery" },
  { value: "planning", label: "Планирование" },
  { value: "execution", label: "Выполнение" },
  { value: "monitoring", label: "Мониторинг" },
  { value: "closing", label: "Закрытие" }
];

interface FiltersProps {
  selectedStage: string;
  selectedTags: string[];
  availableTags: string[];
  onStageChange: (stage: string) => void;
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
}

export default function Filters({
  selectedStage,
  selectedTags,
  availableTags,
  onStageChange,
  onTagToggle,
  onClearFilters
}: FiltersProps) {
  const hasActiveFilters = selectedStage !== "all" || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="min-w-48">
          <Select value={selectedStage} onValueChange={onStageChange}>
            <SelectTrigger data-testid="select-stage">
              <SelectValue placeholder="Выберите этап" />
            </SelectTrigger>
            <SelectContent>
              {STAGES.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-clear-filters"
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      {availableTags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Теги:</h4>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "secondary"}
                className="cursor-pointer hover-elevate"
                onClick={() => onTagToggle(tag)}
                data-testid={`tag-${tag}`}
              >
                {tag}
                {selectedTags.includes(tag) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}