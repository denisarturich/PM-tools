import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import type { Risk, ImpactStrength, Probability, RoamStatus } from "@/pages/RiskManagement";

interface RiskCardProps {
  risk: Risk;
  compact?: boolean;
  showFullInfo?: boolean;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, risk: Risk) => void;
  onClick?: () => void;
}

const getCriticalityColor = (risk: Risk): string => {
  if (!risk.impactStrength || !risk.probability) {
    return 'bg-gray-400';
  }
  if (risk.impactStrength === 'high' && risk.probability === 'high') {
    return 'bg-rose-500';
  }
  if (
    (risk.impactStrength === 'high' && risk.probability === 'medium') ||
    (risk.impactStrength === 'medium' && risk.probability === 'high')
  ) {
    return 'bg-orange-500';
  }
  if (risk.impactStrength === 'medium' && risk.probability === 'medium') {
    return 'bg-amber-500';
  }
  if (
    (risk.impactStrength === 'high' && risk.probability === 'low') ||
    (risk.impactStrength === 'low' && risk.probability === 'high')
  ) {
    return 'bg-yellow-500';
  }
  return 'bg-emerald-500';
};

const getRoamColor = (status: RoamStatus): string => {
  const colors = {
    resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    owned: 'bg-blue-100 text-blue-700 border-blue-200',
    accepted: 'bg-orange-100 text-orange-700 border-orange-200',
    mitigated: 'bg-pink-100 text-pink-700 border-pink-200'
  };
  return status ? colors[status] : '';
};

const getRoamLabel = (status: RoamStatus): string => {
  const labels = {
    resolved: 'Resolved',
    owned: 'Owned',
    accepted: 'Accepted',
    mitigated: 'Mitigated'
  };
  return status ? labels[status] : '';
};

export default function RiskCard({
  risk,
  compact = false,
  showFullInfo = false,
  draggable = false,
  onDragStart,
  onClick
}: RiskCardProps) {
  if (compact) {
    return (
      <Card 
        className="p-3 cursor-move hover:shadow-md transition-shadow"
        draggable={draggable}
        onDragStart={(e) => onDragStart?.(e, risk)}
        onClick={onClick}
      >
        <div className="flex items-start gap-2">
          {/* Criticality indicator */}
          <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${getCriticalityColor(risk)}`} />
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{risk.task}</p>
            <p className="text-xs text-muted-foreground truncate">{risk.risk}</p>
            
            {/* ROAM badge if exists */}
            {risk.roaming && (
              <Badge 
                variant="outline" 
                className={`mt-1 text-xs ${getRoamColor(risk.roaming)}`}
              >
                {getRoamLabel(risk.roaming)}
              </Badge>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Full view for ROAM board
  return (
    <Card 
      className="p-4 cursor-move hover:shadow-md transition-shadow"
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, risk)}
      onClick={onClick}
    >
      <div className="space-y-2">
        {/* Header with indicator */}
        <div className="flex items-start gap-2">
          <div className={`w-3 h-3 rounded-full mt-0.5 ${getCriticalityColor(risk)}`} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {risk.impactStrength ? risk.impactStrength[0].toUpperCase() : '-'}/{risk.probability ? risk.probability[0].toUpperCase() : '-'}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Task and Risk */}
        <div>
          <p className="font-semibold text-sm">{risk.task}</p>
          <p className="text-sm text-muted-foreground">{risk.risk}</p>
        </div>
        
        {/* Impact */}
        {risk.impact && (
          <div className="text-xs">
            <span className="text-muted-foreground">Impact: </span>
            <span>{risk.impact}</span>
          </div>
        )}
        
        {/* Owner (for Owned risks) */}
        {risk.owner && (
          <div className="flex items-center gap-1 text-xs">
            <User className="w-3 h-3" />
            <span>{risk.owner}</span>
          </div>
        )}
        
        {/* Actions (for Mitigated risks) */}
        {risk.actions && (
          <div className="text-xs">
            <span className="text-muted-foreground">Actions: </span>
            <p className="mt-1 whitespace-pre-wrap">{risk.actions}</p>
          </div>
        )}
        
        {/* Warning badges if something is missing */}
        {risk.roaming === 'owned' && !risk.owner && (
          <Badge variant="destructive" className="text-xs">
            ⚠️ Owner missing
          </Badge>
        )}
        {risk.roaming === 'mitigated' && !risk.actions && (
          <Badge variant="destructive" className="text-xs">
            ⚠️ Actions missing
          </Badge>
        )}
      </div>
    </Card>
  );
}
