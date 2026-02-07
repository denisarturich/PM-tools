import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RiskCard from "./RiskCard";
import type { Risk, ImpactStrength, Probability } from "@/pages/RiskManagement";

interface RiskMatrixProps {
  risks: Risk[];
  riskOrder: Record<string, string[]>;
  onUpdate: (id: string, updates: Partial<Risk>) => void;
  onReorder: (squareId: string, reorderedIds: string[]) => void;
  onAddClick: (open: boolean) => void;
}

const getSquareColor = (impact: ImpactStrength, prob: Probability): string => {
  if (impact === 'high' && prob === 'high') {
    return 'bg-rose-200 border-rose-300 dark:bg-rose-900 dark:border-rose-700';
  }
  if ((impact === 'high' && prob === 'medium') || (impact === 'medium' && prob === 'high')) {
    return 'bg-orange-200 border-orange-300 dark:bg-orange-900 dark:border-orange-700';
  }
  if (impact === 'medium' && prob === 'medium') {
    return 'bg-amber-100 border-amber-200 dark:bg-amber-950 dark:border-amber-800';
  }
  if ((impact === 'high' && prob === 'low') || (impact === 'low' && prob === 'high')) {
    return 'bg-yellow-100 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800';
  }
  if ((impact === 'medium' && prob === 'low') || (impact === 'low' && prob === 'medium')) {
    return 'bg-emerald-100 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800';
  }
  return 'bg-emerald-50 border-emerald-100 dark:bg-emerald-950/50 dark:border-emerald-900';
};

const getLabel = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default function RiskMatrix({ risks, riskOrder, onUpdate, onReorder, onAddClick }: RiskMatrixProps) {
  const [draggedRisk, setDraggedRisk] = useState<Risk | null>(null);
  const [dragOverSquare, setDragOverSquare] = useState<string | null>(null);
  const [dragOverRiskId, setDragOverRiskId] = useState<string | null>(null);

  const impactLevels: ImpactStrength[] = ['low', 'medium', 'high'];
  const probabilityLevels: Probability[] = ['high', 'medium', 'low'];

  const getRisksForSquare = (impact: ImpactStrength, prob: Probability): Risk[] => {
    const squareRisks = risks.filter(r => r.impactStrength === impact && r.probability === prob);
    const squareId = `${impact}-${prob}`;
    
    // Sort by custom order if exists
    if (riskOrder[squareId]) {
      const orderMap = new Map(riskOrder[squareId].map((id, index) => [id, index]));
      return squareRisks.sort((a, b) => {
        const orderA = orderMap.get(a.id) ?? 999;
        const orderB = orderMap.get(b.id) ?? 999;
        return orderA - orderB;
      });
    }
    
    return squareRisks;
  };
  
  // Get risks with null values
  const unassignedRisks = risks.filter(r => !r.impactStrength || !r.probability);

  const handleDragStart = (e: React.DragEvent, risk: Risk) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('riskId', risk.id);
    setDraggedRisk(risk);
  };

  const handleDragEnd = () => {
    setDraggedRisk(null);
    setDragOverSquare(null);
  };

  const handleDragOver = (e: React.DragEvent, impact: ImpactStrength, prob: Probability) => {
    e.preventDefault();
    setDragOverSquare(`${impact}-${prob}`);
  };

  const handleDragLeave = () => {
    setDragOverSquare(null);
  };

  const handleDrop = (e: React.DragEvent, targetImpact: ImpactStrength, targetProb: Probability) => {
    e.preventDefault();
    const riskId = e.dataTransfer.getData('riskId');
    
    if (riskId) {
      onUpdate(riskId, {
        impactStrength: targetImpact,
        probability: targetProb
      });
    }
    
    setDragOverSquare(null);
    setDraggedRisk(null);
  };

  const handleUnassignedDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverSquare('unassigned');
  };

  const handleUnassignedDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const riskId = e.dataTransfer.getData('riskId');
    
    if (riskId) {
      onUpdate(riskId, {
        impactStrength: null,
        probability: null
      });
    }
    
    setDragOverSquare(null);
    setDraggedRisk(null);
  };

  const handleRiskDragOver = (e: React.DragEvent, riskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedRisk && draggedRisk.id !== riskId) {
      setDragOverRiskId(riskId);
    }
  };

  const handleRiskDrop = (e: React.DragEvent, targetRiskId: string, impact: ImpactStrength, prob: Probability) => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedId = e.dataTransfer.getData('riskId');
    const draggedRiskData = risks.find(r => r.id === draggedId);
    
    if (!draggedId || !draggedRiskData || draggedId === targetRiskId) {
      setDragOverRiskId(null);
      return;
    }

    const squareId = `${impact}-${prob}`;
    
    // If dragged from different square, update its position first
    if (draggedRiskData.impactStrength !== impact || draggedRiskData.probability !== prob) {
      onUpdate(draggedId, {
        impactStrength: impact,
        probability: prob
      });
    }
    
    // Reorder within the square
    const squareRisks = risks.filter(r => 
      r.impactStrength === impact && r.probability === prob && r.id !== draggedId
    );
    const targetIndex = squareRisks.findIndex(r => r.id === targetRiskId);
    
    const newOrder = squareRisks.map(r => r.id);
    newOrder.splice(targetIndex, 0, draggedId);
    
    onReorder(squareId, newOrder);
    setDragOverRiskId(null);
    setDragOverSquare(null);
    setDraggedRisk(null);
  };

  return (
    <div className="space-y-6">
      {/* Main layout with unassigned risks on left */}
      <div className="flex gap-6">
        {/* UNASSIGNED RISKS - left side */}
        <div className="w-56 flex-shrink-0 mt-6">
          <div 
            className={`border-2 border-dashed rounded-lg p-3 min-h-[708px] transition-all ${
              dragOverSquare === 'unassigned' ? 'border-primary bg-muted/50 ring-2 ring-primary' : ''
            }`}
            onDragOver={handleUnassignedDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleUnassignedDrop}
          >
            <h3 className="font-semibold mb-1 text-sm">Unassigned Risks</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Drag risks here or to matrix
            </p>
            <div className="space-y-1.5 max-h-[600px] overflow-y-auto">
              {unassignedRisks.map(risk => (
                <div 
                  key={risk.id}
                  className={draggedRisk?.id === risk.id ? 'opacity-50' : ''}
                >
                  <RiskCard
                    risk={risk}
                    compact={true}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, risk)}
                  />
                </div>
              ))}
            </div>
            {unassignedRisks.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">
                All risks assessed
              </p>
            )}
          </div>
        </div>
        
        {/* MATRIX - right side */}
        <div className="flex-1">
          <div className="relative">
            {/* Y-axis label */}
            <div className="absolute -left-14 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-semibold text-muted-foreground">
              PROBABILITY →
            </div>
            
            {/* X-axis label */}
            <div className="text-center mb-2 text-xs font-semibold text-muted-foreground">
              IMPACT STRENGTH →
            </div>

            <div className="grid grid-cols-3 gap-3 lg:gap-4">
          {probabilityLevels.map((prob) => (
            impactLevels.map((impact) => {
              const squareRisks = getRisksForSquare(impact, prob);
              const squareId = `${impact}-${prob}`;
              const isDragOver = dragOverSquare === squareId;

              return (
                <div
                  key={squareId}
                  className={`relative border-2 rounded-lg p-3 min-h-[220px] transition-all ${getSquareColor(impact, prob)} ${
                    isDragOver ? 'ring-2 ring-primary scale-[1.02]' : ''
                  }`}
                  onDragOver={(e) => handleDragOver(e, impact, prob)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, impact, prob)}
                >
                  {/* Square label */}
                  <div className="absolute top-2 right-2 text-xs font-semibold opacity-50">
                    {getLabel(impact)}/{getLabel(prob)}
                  </div>
                  
                  {/* Risk count badge */}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {squareRisks.length}
                    </Badge>
                  </div>
                  
                  {/* Risk cards */}
                  <div className="space-y-1.5 mt-8">
                    {squareRisks.map(risk => (
                      <div 
                        key={risk.id}
                        className={`${draggedRisk?.id === risk.id ? 'opacity-50' : ''} ${
                          dragOverRiskId === risk.id ? 'border-t-2 border-primary' : ''
                        }`}
                        onDragOver={(e) => handleRiskDragOver(e, risk.id)}
                        onDrop={(e) => handleRiskDrop(e, risk.id, impact, prob)}
                      >
                        <RiskCard
                          risk={risk}
                          compact={true}
                          draggable={true}
                          onDragStart={(e) => handleDragStart(e, risk)}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Add here button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute bottom-2 right-2 text-xs"
                    onClick={() => onAddClick(true)}
                  >
                    + Add here
                  </Button>
                </div>
              );
            })
          ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-rose-200 border border-rose-300 rounded dark:bg-rose-900 dark:border-rose-700" />
          <span>Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-200 border border-orange-300 rounded dark:bg-orange-900 dark:border-orange-700" />
          <span>High priority</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-100 border border-amber-200 rounded dark:bg-amber-950 dark:border-amber-800" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-100 border border-emerald-200 rounded dark:bg-emerald-950 dark:border-emerald-800" />
          <span>Low priority</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
        <p className="font-semibold mb-1">💡 How to use:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Drag and drop risks between squares to update their impact and probability</li>
          <li>Drag risks onto other risks within a square to reorder them</li>
          <li>Drag back to "Unassigned Risks" box to remove assessment</li>
          <li>Focus on red and orange zones - these need attention first</li>
          <li>Use "Add here" to quickly add a risk with pre-filled values</li>
        </ul>
      </div>
    </div>
  );
}
