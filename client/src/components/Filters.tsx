import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

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

interface Stage {
  value: string;
  label: string;
  color?: string;
  priority?: number;
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
                  <div className="flex items-center gap-2">
                    {stage.color && stage.value !== "all" && (
                      <div 
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${getStageColorClasses(stage.color).split(' ')[0]}`}
                      />
                    )}
                    <span>{stage.label}</span>
                  </div>
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