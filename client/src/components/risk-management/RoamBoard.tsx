import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RiskCard from "./RiskCard";
import type { Risk, RoamStatus } from "@/pages/RiskManagement";

interface RoamBoardProps {
  risks: Risk[];
  riskOrder: Record<string, string[]>;
  onUpdate: (id: string, updates: Partial<Risk>) => void;
  onReorder: (squareId: string, reorderedIds: string[]) => void;
}

interface RoamColumn {
  id: string;
  title: string;
  description: string;
  borderColor: string;
  bgColor: string;
  roamValue: RoamStatus;
}

const roamColumns: RoamColumn[] = [
  {
    id: 'resolved',
    title: 'Resolved',
    description: 'То, что не является риском',
    borderColor: 'border-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    roamValue: 'resolved'
  },
  {
    id: 'owned',
    title: 'Owned',
    description: 'Риск, где назначается ответственный за развитие ситуации',
    borderColor: 'border-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    roamValue: 'owned'
  },
  {
    id: 'accepted',
    title: 'Accepted',
    description: 'Риск не может быть снят, принимаем',
    borderColor: 'border-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    roamValue: 'accepted'
  },
  {
    id: 'mitigated',
    title: 'Mitigated',
    description: 'Риски, где формируем план по устранению или снижению',
    borderColor: 'border-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-950/30',
    roamValue: 'mitigated'
  }
];

export default function RoamBoard({ risks, riskOrder, onUpdate, onReorder }: RoamBoardProps) {
  const [draggedRisk, setDraggedRisk] = useState<Risk | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [dragOverRiskId, setDragOverRiskId] = useState<string | null>(null);
  
  // Dialog states
  const [ownerDialogOpen, setOwnerDialogOpen] = useState(false);
  const [actionsDialogOpen, setActionsDialogOpen] = useState(false);
  const [resolvedDialogOpen, setResolvedDialogOpen] = useState(false);
  const [pendingRiskId, setPendingRiskId] = useState<string | null>(null);
  const [pendingRoamStatus, setPendingRoamStatus] = useState<RoamStatus>(null);
  
  // Input states
  const [ownerInput, setOwnerInput] = useState("");
  const [actionsInput, setActionsInput] = useState("");
  const [resolvedReasonInput, setResolvedReasonInput] = useState("");

  const getRisksForColumn = (roamValue: RoamStatus): Risk[] => {
    const columnRisks = risks.filter(r => r.roaming === roamValue);
    const columnId = roamValue || 'unprocessed';
    
    // Sort by custom order if exists
    if (riskOrder[columnId]) {
      const orderMap = new Map(riskOrder[columnId].map((id, index) => [id, index]));
      return columnRisks.sort((a, b) => {
        const orderA = orderMap.get(a.id) ?? 999;
        const orderB = orderMap.get(b.id) ?? 999;
        return orderA - orderB;
      });
    }
    
    return columnRisks;
  };
  
  const unprocessedRisks = getRisksForColumn(null);

  const handleDragStart = (e: React.DragEvent, risk: Risk) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('riskId', risk.id);
    setDraggedRisk(risk);
  };

  const handleDragEnd = () => {
    setDraggedRisk(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, targetRoam: RoamStatus) => {
    e.preventDefault();
    const riskId = e.dataTransfer.getData('riskId');
    const risk = risks.find(r => r.id === riskId);
    
    if (!risk || !riskId) {
      setDragOverColumn(null);
      setDraggedRisk(null);
      return;
    }

    // If moving to the same column, do nothing
    if (risk.roaming === targetRoam) {
      setDragOverColumn(null);
      setDraggedRisk(null);
      return;
    }

    // Special handling for certain columns
    if (targetRoam === 'owned' && !risk.owner) {
      setPendingRiskId(riskId);
      setPendingRoamStatus(targetRoam);
      setOwnerInput(risk.owner || "");
      setOwnerDialogOpen(true);
    } else if (targetRoam === 'mitigated' && !risk.actions) {
      setPendingRiskId(riskId);
      setPendingRoamStatus(targetRoam);
      setActionsInput(risk.actions || "");
      setActionsDialogOpen(true);
    } else if (targetRoam === 'resolved') {
      setPendingRiskId(riskId);
      setPendingRoamStatus(targetRoam);
      setResolvedReasonInput("");
      setResolvedDialogOpen(true);
    } else {
      // Just update the status
      onUpdate(riskId, { roaming: targetRoam });
    }
    
    setDragOverColumn(null);
    setDraggedRisk(null);
  };

  const handleUnprocessedDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColumn('unprocessed');
  };

  const handleUnprocessedDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const riskId = e.dataTransfer.getData('riskId');
    
    if (riskId) {
      onUpdate(riskId, { roaming: null });
    }
    
    setDragOverColumn(null);
    setDraggedRisk(null);
  };

  const handleOwnerSubmit = () => {
    if (pendingRiskId) {
      onUpdate(pendingRiskId, {
        roaming: pendingRoamStatus,
        owner: ownerInput.trim() || undefined
      });
    }
    setOwnerDialogOpen(false);
    setOwnerInput("");
    setPendingRiskId(null);
    setPendingRoamStatus(null);
  };

  const handleActionsSubmit = () => {
    if (pendingRiskId) {
      onUpdate(pendingRiskId, {
        roaming: pendingRoamStatus,
        actions: actionsInput.trim()
      });
    }
    setActionsDialogOpen(false);
    setActionsInput("");
    setPendingRiskId(null);
    setPendingRoamStatus(null);
  };

  const handleResolvedSubmit = () => {
    if (pendingRiskId) {
      onUpdate(pendingRiskId, {
        roaming: pendingRoamStatus,
        actions: resolvedReasonInput.trim() ? `Resolved: ${resolvedReasonInput.trim()}` : ""
      });
    }
    setResolvedDialogOpen(false);
    setResolvedReasonInput("");
    setPendingRiskId(null);
    setPendingRoamStatus(null);
  };

  const closeOwnerDialog = () => {
    if (pendingRiskId) {
      onUpdate(pendingRiskId, { roaming: pendingRoamStatus });
    }
    setOwnerDialogOpen(false);
    setOwnerInput("");
    setPendingRiskId(null);
    setPendingRoamStatus(null);
  };

  const closeActionsDialog = () => {
    if (pendingRiskId) {
      onUpdate(pendingRiskId, { roaming: pendingRoamStatus });
    }
    setActionsDialogOpen(false);
    setActionsInput("");
    setPendingRiskId(null);
    setPendingRoamStatus(null);
  };

  const closeResolvedDialog = () => {
    setResolvedDialogOpen(false);
    setResolvedReasonInput("");
    setPendingRiskId(null);
    setPendingRoamStatus(null);
  };

  const handleRiskDragOver = (e: React.DragEvent, riskId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedRisk && draggedRisk.id !== riskId) {
      setDragOverRiskId(riskId);
    }
  };

  const handleRiskDrop = (e: React.DragEvent, targetRiskId: string, targetRoam: RoamStatus) => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedId = e.dataTransfer.getData('riskId');
    const draggedRiskData = risks.find(r => r.id === draggedId);
    
    if (!draggedId || !draggedRiskData || draggedId === targetRiskId) {
      setDragOverRiskId(null);
      return;
    }

    const columnId = targetRoam || 'unprocessed';
    
    // If dragged from different column, update its status first
    if (draggedRiskData.roaming !== targetRoam) {
      onUpdate(draggedId, { roaming: targetRoam });
    }
    
    // Reorder within the column
    const columnRisks = risks.filter(r => 
      r.roaming === targetRoam && r.id !== draggedId
    );
    const targetIndex = columnRisks.findIndex(r => r.id === targetRiskId);
    
    const newOrder = columnRisks.map(r => r.id);
    newOrder.splice(targetIndex, 0, draggedId);
    
    onReorder(columnId, newOrder);
    setDragOverRiskId(null);
    setDragOverColumn(null);
    setDraggedRisk(null);
  };

  return (
    <div className="space-y-6">
      {/* Main Layout: Unprocessed on left, 2x2 grid on right */}
      <div className="flex gap-6">
        {/* UNPROCESSED RISKS - left side */}
        <div className="w-64 flex-shrink-0">
          <div 
            className={`border-2 border-dashed rounded-lg p-4 min-h-[680px] transition-all ${
              dragOverColumn === 'unprocessed' ? 'border-primary bg-muted/50 ring-2 ring-primary' : 'border-gray-300'
            }`}
            onDragOver={handleUnprocessedDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleUnprocessedDrop}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">Unprocessed</h3>
              <Badge variant="secondary" className="text-xs">
                {unprocessedRisks.length}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Drag to ROAM grid
            </p>
            
            <div className="space-y-2 max-h-[580px] overflow-y-auto">
              {unprocessedRisks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-xs border-2 border-dashed rounded-lg">
                  All risks processed
                </div>
              ) : (
                unprocessedRisks.map(risk => (
                  <div 
                    key={risk.id}
                    className={`${draggedRisk?.id === risk.id ? 'opacity-50' : ''} ${
                      dragOverRiskId === risk.id ? 'border-t-2 border-primary' : ''
                    }`}
                    onDragOver={(e) => handleRiskDragOver(e, risk.id)}
                    onDrop={(e) => handleRiskDrop(e, risk.id, null)}
                  >
                    <RiskCard
                      risk={risk}
                      compact={true}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, risk)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* 2×2 GRID - right side */}
        <div className="flex-1">
            {/* 2×2 Grid */}
            <div className="grid grid-cols-2 gap-4">
              {roamColumns.map((column) => {
                const columnRisks = getRisksForColumn(column.roamValue);
                const isDragOver = dragOverColumn === column.id;

                return (
                  <Card
                    key={column.id}
                    className={`border-2 p-4 transition-all ${column.borderColor} ${column.bgColor} ${
                      isDragOver ? 'ring-2 ring-primary scale-[1.02]' : ''
                    }`}
                    onDragOver={(e) => handleDragOver(e, column.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, column.roamValue)}
                  >
                    {/* Header */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{column.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {columnRisks.length}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {column.description}
                      </p>
                    </div>
                    
                    {/* Risk cards */}
                    <div className="space-y-2 min-h-[280px] max-h-[280px] overflow-y-auto">
                      {columnRisks.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground text-xs border-2 border-dashed rounded-lg">
                          Drag risks here
                        </div>
                      ) : (
                        columnRisks.map(risk => (
                          <div 
                            key={risk.id}
                            className={`${draggedRisk?.id === risk.id ? 'opacity-50' : ''} ${
                              dragOverRiskId === risk.id ? 'border-t-2 border-primary' : ''
                            }`}
                            onDragOver={(e) => handleRiskDragOver(e, risk.id)}
                            onDrop={(e) => handleRiskDrop(e, risk.id, column.roamValue)}
                          >
                            <RiskCard
                              risk={risk}
                              showFullInfo={true}
                              draggable={true}
                              onDragStart={(e) => handleDragStart(e, risk)}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg">
        <p className="font-semibold mb-2">🗂️ ROAM Framework:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Drag risks from "Unprocessed" to appropriate ROAM category</li>
          <li>Drag risks onto other risks within a column to reorder them</li>
          <li>Drag back to "Unprocessed" to reset ROAM status</li>
          <li><strong className="text-emerald-600">Resolved:</strong> Not actually a risk after discussion</li>
          <li><strong className="text-blue-600">Owned:</strong> Assigned to someone who monitors it</li>
          <li><strong className="text-orange-600">Accepted:</strong> Risk is accepted, no action taken</li>
          <li><strong className="text-pink-600">Mitigated:</strong> Actions planned to reduce the risk</li>
        </ul>
      </div>

      {/* Owner Dialog */}
      <Dialog open={ownerDialogOpen} onOpenChange={setOwnerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Owner</DialogTitle>
            <DialogDescription>
              Who will monitor this risk?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              placeholder="Owner name (e.g. Sarah, Alex)" 
              value={ownerInput}
              onChange={(e) => setOwnerInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleOwnerSubmit();
              }}
            />
            <div className="flex gap-2">
              <Button onClick={handleOwnerSubmit}>Assign</Button>
              <Button variant="outline" onClick={closeOwnerDialog}>
                Skip for now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Actions Dialog */}
      <Dialog open={actionsDialogOpen} onOpenChange={setActionsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mitigation Plan</DialogTitle>
            <DialogDescription>
              What actions will reduce this risk?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea 
              placeholder="e.g. 
- Create backup before migration
- Test on staging
- Prepare rollback plan
- Assign DBA on duty"
              rows={6}
              value={actionsInput}
              onChange={(e) => setActionsInput(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleActionsSubmit}>Save</Button>
              <Button variant="outline" onClick={closeActionsDialog}>
                Skip for now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resolved Dialog */}
      <Dialog open={resolvedDialogOpen} onOpenChange={setResolvedDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Resolved</DialogTitle>
            <DialogDescription>
              Why is this not a risk?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea 
              placeholder="e.g. Checked with vendor - their SLA is 99.9%, no real risk here"
              rows={4}
              value={resolvedReasonInput}
              onChange={(e) => setResolvedReasonInput(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleResolvedSubmit}>Mark Resolved</Button>
              <Button variant="outline" onClick={closeResolvedDialog}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
