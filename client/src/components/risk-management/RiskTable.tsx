import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Trash2, Plus } from "lucide-react";
import type { Risk, ImpactStrength, Probability, RoamStatus } from "@/pages/RiskManagement";

interface RiskTableProps {
  risks: Risk[];
  onUpdate: (id: string, updates: Partial<Risk>) => void;
  onDelete: (id: string) => void;
  onAdd: (risk: Omit<Risk, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const getImpactColor = (strength: ImpactStrength | null) => {
  if (!strength) return '';
  const colors = {
    low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    high: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
  };
  return colors[strength];
};

const getProbabilityColor = (prob: Probability | null) => {
  return getImpactColor(prob);
};

const getRoamColor = (status: RoamStatus) => {
  if (!status) return '';
  const colors = {
    resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    owned: 'bg-blue-100 text-blue-700 border-blue-200',
    accepted: 'bg-orange-100 text-orange-700 border-orange-200',
    mitigated: 'bg-pink-100 text-pink-700 border-pink-200'
  };
  return colors[status];
};

export default function RiskTable({ risks, onUpdate, onDelete, onAdd }: RiskTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [editingCell, setEditingCell] = useState<{ riskId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState("");
  
  // New risk form state
  const [newRisk, setNewRisk] = useState({
    task: "",
    risk: "",
    impact: "",
    impactStrength: null as ImpactStrength | null,
    probability: null as Probability | null,
    roaming: null as RoamStatus,
    actions: ""
  });

  const filteredRisks = useMemo(() => {
    let filtered = risks;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.task.toLowerCase().includes(query) ||
        r.risk.toLowerCase().includes(query) ||
        r.impact.toLowerCase().includes(query) ||
        r.actions.toLowerCase().includes(query)
      );
    }

    // Apply filter
    switch (filterType) {
      case 'high-impact':
        filtered = filtered.filter(r => r.impactStrength === 'high');
        break;
      case 'high-probability':
        filtered = filtered.filter(r => r.probability === 'high');
        break;
      case 'critical':
        filtered = filtered.filter(r => r.impactStrength === 'high' && r.probability === 'high');
        break;
      case 'no-roam':
        filtered = filtered.filter(r => r.roaming === null);
        break;
      case 'mitigated':
        filtered = filtered.filter(r => r.roaming === 'mitigated');
        break;
      case 'owned':
        filtered = filtered.filter(r => r.roaming === 'owned');
        break;
      case 'accepted':
        filtered = filtered.filter(r => r.roaming === 'accepted');
        break;
      case 'resolved':
        filtered = filtered.filter(r => r.roaming === 'resolved');
        break;
    }

    return filtered;
  }, [risks, searchQuery, filterType]);

  const startEditing = (riskId: string, field: string, currentValue: string) => {
    setEditingCell({ riskId, field });
    setEditValue(currentValue);
  };

  const saveEdit = (riskId: string, field: string) => {
    onUpdate(riskId, { [field]: editValue });
    setEditingCell(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const getWarningIndicator = (risk: Risk) => {
    if (risk.impactStrength === 'high' && risk.probability === 'high' && risk.roaming === null) {
      return { color: 'border-rose-500', tooltip: '⚠️ Critical risk needs ROAM decision' };
    }
    if (risk.roaming === 'mitigated' && !risk.actions) {
      return { color: 'border-amber-500', tooltip: '⚠️ Mitigation plan missing actions' };
    }
    if (risk.roaming === 'owned' && !risk.owner) {
      return { color: 'border-blue-500', tooltip: '⚠️ Owner not assigned' };
    }
    return null;
  };

  const handleQuickAdd = () => {
    if (!newRisk.risk.trim()) return;
    
    onAdd({
      task: newRisk.task.trim(),
      risk: newRisk.risk.trim(),
      impact: newRisk.impact.trim(),
      impactStrength: newRisk.impactStrength,
      probability: newRisk.probability,
      roaming: newRisk.roaming,
      actions: newRisk.actions.trim(),
      owner: undefined
    });
    
    // Clear form
    setNewRisk({
      task: "",
      risk: "",
      impact: "",
      impactStrength: null,
      probability: null,
      roaming: null,
      actions: ""
    });
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search risks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All risks</SelectItem>
            <SelectItem value="high-impact">High impact only</SelectItem>
            <SelectItem value="high-probability">High probability only</SelectItem>
            <SelectItem value="critical">Critical (High/High)</SelectItem>
            <SelectItem value="no-roam">No ROAM status</SelectItem>
            <SelectItem value="mitigated">Mitigated</SelectItem>
            <SelectItem value="owned">Owned</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[150px]">Task</TableHead>
              <TableHead className="w-[200px]">Risk</TableHead>
              <TableHead className="w-[200px]">Impact</TableHead>
              <TableHead className="w-[120px]">Strength</TableHead>
              <TableHead className="w-[120px]">Probability</TableHead>
              <TableHead className="w-[120px]">ROAM</TableHead>
              <TableHead className="w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRisks.map((risk) => {
              const warning = getWarningIndicator(risk);
              return (
                <TableRow key={risk.id} className={warning ? `border-l-4 ${warning.color}` : ''}>
                  {/* Delete */}
                  <TableCell className="text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(risk.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete risk</TooltipContent>
                    </Tooltip>
                  </TableCell>
                  {/* Task */}
                  <TableCell>
                    {editingCell?.riskId === risk.id && editingCell?.field === 'task' ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => saveEdit(risk.id, 'task')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(risk.id, 'task');
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                        className="h-8"
                      />
                    ) : (
                      <div
                        onClick={() => startEditing(risk.id, 'task', risk.task)}
                        className="cursor-text hover:bg-accent/50 p-1 rounded"
                      >
                        {risk.task}
                      </div>
                    )}
                  </TableCell>

                  {/* Risk */}
                  <TableCell>
                    {editingCell?.riskId === risk.id && editingCell?.field === 'risk' ? (
                      <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => saveEdit(risk.id, 'risk')}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                        className="min-h-[60px]"
                      />
                    ) : (
                      <div
                        onClick={() => startEditing(risk.id, 'risk', risk.risk)}
                        className="cursor-text hover:bg-accent/50 p-1 rounded"
                      >
                        {risk.risk}
                      </div>
                    )}
                  </TableCell>

                  {/* Impact */}
                  <TableCell>
                    {editingCell?.riskId === risk.id && editingCell?.field === 'impact' ? (
                      <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => saveEdit(risk.id, 'impact')}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                        className="min-h-[60px]"
                      />
                    ) : (
                      <div
                        onClick={() => startEditing(risk.id, 'impact', risk.impact)}
                        className="cursor-text hover:bg-accent/50 p-1 rounded"
                      >
                        {risk.impact || <span className="text-muted-foreground">Click to add</span>}
                      </div>
                    )}
                  </TableCell>

                  {/* Impact Strength */}
                  <TableCell className={getImpactColor(risk.impactStrength)}>
                    <Select
                      value={risk.impactStrength || "empty"}
                      onValueChange={(value) => onUpdate(risk.id, { impactStrength: value === "empty" ? null : value as ImpactStrength })}
                    >
                      <SelectTrigger className="border-0 bg-transparent">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="empty">-</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Probability */}
                  <TableCell className={getProbabilityColor(risk.probability)}>
                    <Select
                      value={risk.probability || "empty"}
                      onValueChange={(value) => onUpdate(risk.id, { probability: value === "empty" ? null : value as Probability })}
                    >
                      <SelectTrigger className="border-0 bg-transparent">
                        <SelectValue placeholder="-" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="empty">-</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* ROAM */}
                  <TableCell>
                    <Select
                      value={risk.roaming || 'none'}
                      onValueChange={(value) => onUpdate(risk.id, { roaming: value === 'none' ? null : value as RoamStatus })}
                    >
                      <SelectTrigger className={risk.roaming ? getRoamColor(risk.roaming) : ''}>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="owned">Owned</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="mitigated">Mitigated</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    {editingCell?.riskId === risk.id && editingCell?.field === 'actions' ? (
                      <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => saveEdit(risk.id, 'actions')}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') cancelEdit();
                        }}
                        autoFocus
                        className="min-h-[60px]"
                      />
                    ) : (
                      <div
                        onClick={() => startEditing(risk.id, 'actions', risk.actions)}
                        className="cursor-text hover:bg-accent/50 p-1 rounded"
                      >
                        {risk.actions || <span className="text-muted-foreground">Click to add</span>}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            
            {/* ADD NEW RISK ROW - at the bottom */}
            <TableRow className="bg-accent/30 hover:bg-accent/40">
              <TableCell className="text-center">
                <Plus className="w-4 h-4 text-muted-foreground inline-block" />
              </TableCell>
              <TableCell>
                <Input 
                  placeholder="Task (optional)"
                  value={newRisk.task}
                  onChange={(e) => setNewRisk({...newRisk, task: e.target.value})}
                  className="border-0 bg-transparent h-8 focus-visible:ring-0"
                />
              </TableCell>
              <TableCell>
                <Input 
                  placeholder="Risk description *"
                  value={newRisk.risk}
                  onChange={(e) => setNewRisk({...newRisk, risk: e.target.value})}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newRisk.risk.trim()) {
                      handleQuickAdd();
                    }
                  }}
                  className="border-0 bg-transparent h-8 focus-visible:ring-0"
                />
              </TableCell>
              <TableCell>
                <Input 
                  placeholder="Impact (optional)"
                  value={newRisk.impact}
                  onChange={(e) => setNewRisk({...newRisk, impact: e.target.value})}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newRisk.risk.trim()) {
                      handleQuickAdd();
                    }
                  }}
                  className="border-0 bg-transparent h-8 focus-visible:ring-0"
                />
              </TableCell>
              
              {/* Impact Strength */}
              <TableCell className={newRisk.impactStrength ? getImpactColor(newRisk.impactStrength) : ''}>
                <Select
                  value={newRisk.impactStrength || "empty"}
                  onValueChange={(value) => setNewRisk({...newRisk, impactStrength: value === "empty" ? null : value as ImpactStrength})}
                >
                  <SelectTrigger className="border-0 bg-transparent h-8">
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empty">-</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              
              {/* Probability */}
              <TableCell className={newRisk.probability ? getProbabilityColor(newRisk.probability) : ''}>
                <Select
                  value={newRisk.probability || "empty"}
                  onValueChange={(value) => setNewRisk({...newRisk, probability: value === "empty" ? null : value as Probability})}
                >
                  <SelectTrigger className="border-0 bg-transparent h-8">
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="empty">-</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              
              {/* ROAM */}
              <TableCell>
                <Select
                  value={newRisk.roaming || 'none'}
                  onValueChange={(value) => setNewRisk({...newRisk, roaming: value === 'none' ? null : value as RoamStatus})}
                >
                  <SelectTrigger className={newRisk.roaming ? getRoamColor(newRisk.roaming) : 'h-8'}>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="owned">Owned</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="mitigated">Mitigated</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              
              {/* Actions */}
              <TableCell>
                <Input 
                  placeholder="Actions (optional)"
                  value={newRisk.actions}
                  onChange={(e) => setNewRisk({...newRisk, actions: e.target.value})}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newRisk.risk.trim()) {
                      handleQuickAdd();
                    }
                  }}
                  className="border-0 bg-transparent h-8 focus-visible:ring-0"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {filteredRisks.length === 0 && risks.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No risks match your filters
        </div>
      )}
    </div>
  );
}
