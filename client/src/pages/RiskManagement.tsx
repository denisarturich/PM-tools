import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RiskTable from "@/components/risk-management/RiskTable";
import RiskMatrix from "@/components/risk-management/RiskMatrix";
import RoamBoard from "@/components/risk-management/RoamBoard";
import AddRiskDialog from "@/components/risk-management/AddRiskDialog";

export type ImpactStrength = 'low' | 'medium' | 'high';
export type Probability = 'low' | 'medium' | 'high';
export type RoamStatus = 'resolved' | 'owned' | 'accepted' | 'mitigated' | null;

export interface Risk {
  id: string;
  task: string;
  risk: string;
  impact: string;
  impactStrength: ImpactStrength | null;
  probability: Probability | null;
  roaming: RoamStatus;
  actions: string;
  owner?: string;
  createdAt: string;
  updatedAt: string;
}

const EXAMPLE_RISKS: Risk[] = [
  {
    id: crypto.randomUUID(),
    task: "Mobile app release",
    risk: "App Store might reject submission due to unclear privacy policy",
    impact: "Release delayed by 2 weeks, miss Q1 marketing window",
    impactStrength: "high",
    probability: "medium",
    roaming: "mitigated",
    actions: "- Submit explanatory note with review\n- Prepare alternative policy wording\n- Have legal team on standby",
    owner: "Sarah",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    task: "Database migration",
    risk: "Migration script might fail on production due to data inconsistencies",
    impact: "Service downtime for 2-4 hours, potential data loss",
    impactStrength: "high",
    probability: "low",
    roaming: "mitigated",
    actions: "- Full backup before migration\n- Test on staging with prod snapshot\n- Rollback plan ready\n- DBA on duty during migration",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    task: "New feature launch",
    risk: "Competitor might launch similar feature before us",
    impact: "Reduced market impact, less PR buzz",
    impactStrength: "medium",
    probability: "medium",
    roaming: "owned",
    owner: "Alex",
    actions: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    task: "API integration",
    risk: "Third-party API might have downtime during launch",
    impact: "Feature partially unavailable, customer complaints",
    impactStrength: "medium",
    probability: "low",
    roaming: "accepted",
    actions: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: crypto.randomUUID(),
    task: "UI redesign",
    risk: "Users might not like the new design",
    impact: "Negative feedback, possible churn",
    impactStrength: "low",
    probability: "medium",
    roaming: null,
    actions: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function RiskManagement() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [riskOrder, setRiskOrder] = useState<Record<string, string[]>>({});
  const [activeTab, setActiveTab] = useState<'table' | 'matrix' | 'roam'>('table');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pm-tools-risks');
    const savedOrder = localStorage.getItem('pm-tools-risks-order');
    if (saved) {
      try {
        setRisks(JSON.parse(saved));
        if (savedOrder) {
          setRiskOrder(JSON.parse(savedOrder));
        }
      } catch (error) {
        console.error('Error loading risks:', error);
        setRisks(EXAMPLE_RISKS);
      }
    } else {
      setRisks(EXAMPLE_RISKS);
    }
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem('pm-tools-risks', JSON.stringify(risks));
    localStorage.setItem('pm-tools-risks-order', JSON.stringify(riskOrder));
  }, [risks, riskOrder]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setAddDialogOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addRisk = (newRisk: Omit<Risk, 'id' | 'createdAt' | 'updatedAt'>) => {
    const risk: Risk = {
      ...newRisk,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setRisks([...risks, risk]);
    toast({
      title: "Risk added",
      description: "New risk has been added to the list.",
    });
  };

  const updateRisk = (id: string, updates: Partial<Risk>) => {
    setRisks(risks.map(r => 
      r.id === id 
        ? { ...r, ...updates, updatedAt: new Date().toISOString() }
        : r
    ));
  };

  const deleteRisk = (id: string) => {
    setRisks(risks.filter(r => r.id !== id));
    toast({
      title: "Risk deleted",
      description: "Risk has been removed from the list.",
    });
  };

  const reorderRisks = (squareId: string, reorderedIds: string[]) => {
    setRiskOrder(prev => ({
      ...prev,
      [squareId]: reorderedIds
    }));
  };

  const clearAllRisks = () => {
    setRisks([]);
    setRiskOrder({});
    setClearDialogOpen(false);
    toast({
      title: "All risks cleared",
      description: "Your risk list has been reset.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export feature",
      description: "Excel export coming soon! For now, use browser print.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Main content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button variant="outline" onClick={handleExport}>
            Export to Excel
          </Button>
          <Button variant="destructive" onClick={() => setClearDialogOpen(true)}>
            Clear All
          </Button>
          <div className="ml-auto">
            <Badge variant="secondary">
              {risks.length} {risks.length === 1 ? 'risk' : 'risks'}
            </Badge>
          </div>
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="mb-6">
            <TabsTrigger value="table">📊 Table</TabsTrigger>
            <TabsTrigger value="matrix">🎯 Matrix</TabsTrigger>
            <TabsTrigger value="roam">🗂️ ROAM Board</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table">
            <RiskTable 
              risks={risks} 
              onUpdate={updateRisk}
              onDelete={deleteRisk}
              onAdd={addRisk}
            />
          </TabsContent>
          
          <TabsContent value="matrix">
            <RiskMatrix 
              risks={risks}
              riskOrder={riskOrder}
              onUpdate={updateRisk}
              onReorder={reorderRisks}
              onAddClick={setAddDialogOpen}
            />
          </TabsContent>
          
          <TabsContent value="roam">
            <RoamBoard 
              risks={risks}
              riskOrder={riskOrder}
              onUpdate={updateRisk}
              onReorder={reorderRisks}
            />
          </TabsContent>
        </Tabs>
        </div>
      </main>
      
      <Footer />
      
      {/* Add Risk Dialog */}
      <AddRiskDialog 
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAdd={addRisk}
      />

      {/* Clear All Confirmation Dialog */}
      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all risks?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {risks.length} risks. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={clearAllRisks} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
