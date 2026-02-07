import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Filters from "@/components/Filters";
import PromptCard from "@/components/PromptCard";
import PromptModal from "@/components/PromptModal";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { type Prompt, type PromptsResponse } from "@shared/schema";

// Fetch prompts from API
const fetchPrompts = async (stage?: string): Promise<PromptsResponse> => {
  const url = new URL("/api/prompts", window.location.origin);
  if (stage && stage !== "all") {
    url.searchParams.set("stage", stage);
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch prompts");
  }
  
  const data = await response.json();
  // Convert date strings to Date objects
  return {
    ...data,
    prompts: data.prompts.map((prompt: any) => ({
      ...prompt,
      createdAt: new Date(prompt.createdAt),
      updatedAt: new Date(prompt.updatedAt),
    })),
  };
};

export default function Home() {
  const [selectedStage, setSelectedStage] = useState("all");
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  
  const linkedinUrl = "https://www.linkedin.com/in/nikden";
  const fallbackEmail = "dnicolaev92@gmail.com";

  // Fetch prompts with React Query
  const { 
    data: promptsData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ["prompts", selectedStage],
    queryFn: () => fetchPrompts(selectedStage),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const filteredPrompts = promptsData?.prompts || [];

  const handleClearFilters = () => {
    setSelectedStage("all");
  };

  const handleExpandPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setIsModalOpen(true);
  };

  const handleSuggestPrompt = () => {
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
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-6 max-w-7xl py-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Filters
            selectedStage={selectedStage}
            selectedTags={[]}
            availableTags={[]}
            onStageChange={setSelectedStage}
            onTagToggle={() => {}}
            onClearFilters={handleClearFilters}
          />
          
          <Button 
            asChild
            size="sm"
            variant="outline"
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

          {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading prompts...</p>
          </div>
          ) : error ? (
          <div className="text-center py-8">
            <p className="text-destructive">Error loading prompts</p>
            <p className="text-sm text-muted-foreground mt-2">
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
          ) : filteredPrompts.length === 0 ? (
          <EmptyState />
          ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                id={prompt.id}
                title={prompt.title}
                summary={prompt.summary}
                stage={prompt.stage}
                stageDetails={(prompt as any).stageDetails}
                tags={[]}
                fullText={prompt.fullText}
                onExpand={() => handleExpandPrompt(prompt)}
              />
            ))}
          </div>
          )}
        </div>
      </main>

      <PromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        prompt={selectedPrompt}
      />
      
      <Footer />
    </div>
  );
}