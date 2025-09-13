import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const STAGES = [
  { value: "all", label: "Все этапы" },
  { value: "initiation", label: "Инициация" },
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
  onStageChange,
  onClearFilters
}: FiltersProps) {
  const hasActiveFilters = selectedStage !== "all";

  return (
    <div className="flex flex-wrap gap-4 items-center">
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
          Показать все
        </button>
      )}
    </div>
  );
}