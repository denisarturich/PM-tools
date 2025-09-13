import { useState } from 'react';
import Filters from '../Filters';

export default function FiltersExample() {
  const [selectedStage, setSelectedStage] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const availableTags = ["анализ", "планирование", "риски", "коммуникации", "ретроспектива"];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedStage("all");
    setSelectedTags([]);
  };

  return (
    <div className="p-4">
      <Filters
        selectedStage={selectedStage}
        selectedTags={selectedTags}
        availableTags={availableTags}
        onStageChange={setSelectedStage}
        onTagToggle={handleTagToggle}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}