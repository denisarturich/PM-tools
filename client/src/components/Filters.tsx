import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Stage {
  value: string;
  label: string;
}

interface StagesResponse {
  stages: Stage[];
}

// Функция для получения стадий из API
const fetchStages = async (): Promise<StagesResponse> => {
  const response = await fetch("/api/stages");
  if (!response.ok) {
    throw new Error("Failed to fetch stages");
  }
  return response.json();
};

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

  // Получаем стадии из API
  const { data: stagesData, isLoading: stagesLoading } = useQuery({
    queryKey: ["stages"],
    queryFn: fetchStages,
    staleTime: 10 * 60 * 1000, // 10 минут
  });

  const stages = stagesData?.stages || [];

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="min-w-48">
        <Select value={selectedStage} onValueChange={onStageChange}>
          <SelectTrigger data-testid="select-stage">
            <SelectValue placeholder="Select stage" />
          </SelectTrigger>
          <SelectContent>
            {stagesLoading ? (
              <SelectItem value="all">Loading stages...</SelectItem>
            ) : (
              stages.map((stage) => (
                <SelectItem key={stage.value} value={stage.value}>
                  {stage.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-clear-filters"
        >
          Show all
        </button>
      )}
    </div>
  );
}