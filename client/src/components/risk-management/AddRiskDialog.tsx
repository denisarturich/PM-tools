import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ImpactStrength, Probability, Risk } from "@/pages/RiskManagement";

interface AddRiskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (risk: Omit<Risk, 'id' | 'createdAt' | 'updatedAt'>) => void;
  prefilledImpact?: ImpactStrength;
  prefilledProbability?: Probability;
}

export default function AddRiskDialog({
  open,
  onOpenChange,
  onAdd,
  prefilledImpact,
  prefilledProbability
}: AddRiskDialogProps) {
  const [taskInput, setTaskInput] = useState("");
  const [riskInput, setRiskInput] = useState("");
  const [impactInput, setImpactInput] = useState("");
  const [impactStrength, setImpactStrength] = useState<ImpactStrength>(prefilledImpact || "medium");
  const [probability, setProbability] = useState<Probability>(prefilledProbability || "medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskInput.trim() || !riskInput.trim()) {
      return;
    }

    onAdd({
      task: taskInput.trim(),
      risk: riskInput.trim(),
      impact: impactInput.trim(),
      impactStrength,
      probability,
      roaming: null,
      actions: "",
      owner: undefined
    });

    // Reset form
    setTaskInput("");
    setRiskInput("");
    setImpactInput("");
    setImpactStrength("medium");
    setProbability("medium");
    onOpenChange(false);
  };

  const handleClose = () => {
    setTaskInput("");
    setRiskInput("");
    setImpactInput("");
    setImpactStrength("medium");
    setProbability("medium");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Risk</DialogTitle>
          <DialogDescription>
            Identify a potential risk for your project
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task field */}
          <div>
            <Label htmlFor="task">Task / Feature *</Label>
            <Input 
              id="task"
              placeholder="e.g. Mobile app release"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              What are you working on?
            </p>
          </div>
          
          {/* Risk field */}
          <div>
            <Label htmlFor="risk">Risk Description *</Label>
            <Textarea 
              id="risk"
              placeholder="e.g. App Store might reject the submission"
              value={riskInput}
              onChange={(e) => setRiskInput(e.target.value)}
              rows={3}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              What could go wrong?
            </p>
          </div>
          
          {/* Impact field */}
          <div>
            <Label htmlFor="impact">Impact</Label>
            <Textarea 
              id="impact"
              placeholder="e.g. Release delayed by 2 weeks, miss marketing window"
              value={impactInput}
              onChange={(e) => setImpactInput(e.target.value)}
              rows={2}
            />
            <p className="text-xs text-muted-foreground mt-1">
              What happens if this risk materializes?
            </p>
          </div>
          
          {/* Impact Strength */}
          <div>
            <Label>Impact Strength</Label>
            <Select value={impactStrength} onValueChange={(value) => setImpactStrength(value as ImpactStrength)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Probability */}
          <div>
            <Label>Probability</Label>
            <Select value={probability} onValueChange={(value) => setProbability(value as Probability)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Buttons */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Add Risk</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
