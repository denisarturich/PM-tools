import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Risk } from '@/pages/RiskManagement';

interface RiskSelectorProps {
  risks: Risk[];
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedRisks: Risk[]) => void;
}

export function RiskSelector({ risks, open, onClose, onConfirm }: RiskSelectorProps) {
  // Initialize with ALL risks selected by default
  const [selected, setSelected] = useState<Set<string>>(() => new Set(risks.map(r => r.id)));
  
  // Update selected when risks change or dialog opens
  useEffect(() => {
    if (open) {
      setSelected(new Set(risks.map(r => r.id)));
    }
  }, [open, risks]);
  
  const toggleRisk = (riskId: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(riskId)) {
        next.delete(riskId);
      } else {
        next.add(riskId);
      }
      return next;
    });
  };
  
  const toggleAll = () => {
    if (selected.size === risks.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(risks.map(r => r.id)));
    }
  };
  
  const handleConfirm = () => {
    const selectedRisks = risks.filter(r => selected.has(r.id));
    onConfirm(selectedRisks);
    onClose();
  };
  
  const getRiskPriorityColor = (risk: Risk) => {
    if (risk.impactStrength === 'high' && risk.probability === 'high') {
      return 'bg-red-100 dark:bg-red-950 border-red-300 dark:border-red-800';
    }
    if (risk.impactStrength === 'high' || risk.probability === 'high') {
      return 'bg-orange-100 dark:bg-orange-950 border-orange-300 dark:border-orange-800';
    }
    if (risk.impactStrength === 'medium' || risk.probability === 'medium') {
      return 'bg-yellow-100 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-800';
    }
    return 'bg-muted border-border';
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select Risks for Mitigation Analysis</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            All risks are selected by default. Deselect any you want to exclude from the analysis.
          </p>
        </DialogHeader>
        
        <div className="space-y-3">
          {/* Select All */}
          <div className="flex items-center gap-2 border-b pb-2">
            <Checkbox 
              checked={selected.size === risks.length}
              onCheckedChange={toggleAll}
            />
            <span className="font-medium">
              Select All ({selected.size}/{risks.length})
            </span>
          </div>
          
          {/* Risk List */}
          <div className="space-y-2 overflow-y-auto max-h-96">
            {risks.map(risk => (
              <div 
                key={risk.id} 
                className={`flex items-start gap-2 p-3 rounded border cursor-pointer transition-colors hover:bg-accent ${getRiskPriorityColor(risk)}`}
                onClick={() => toggleRisk(risk.id)}
              >
                <Checkbox 
                  checked={selected.has(risk.id)}
                  onCheckedChange={() => toggleRisk(risk.id)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{risk.risk}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      Impact: <span className="font-medium capitalize">{risk.impactStrength || 'N/A'}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      Probability: <span className="font-medium capitalize">{risk.probability || 'N/A'}</span>
                    </span>
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {risk.roaming && (
                    <span className="px-2 py-0.5 text-xs rounded bg-primary/10 font-medium capitalize">
                      {risk.roaming}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleConfirm}
            disabled={selected.size === 0}
          >
            Analyze {selected.size} Risk{selected.size !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
