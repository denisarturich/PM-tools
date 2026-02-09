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
import ExcelJS from 'exceljs';

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
        setRisks([]);
      }
    }
    // Start with empty list if no saved data
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

  const exportToExcel = async () => {
    // Check if there are any risks to export
    if (risks.length === 0) {
      toast({
        title: "No data to export",
        description: "Add some risks first before exporting.",
        variant: "destructive",
      });
      return;
    }

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Risks');

    // Define columns with headers
    worksheet.columns = [
      { header: 'Task', key: 'task', width: 20 },
      { header: 'Risk', key: 'risk', width: 30 },
      { header: 'Impact', key: 'impact', width: 30 },
      { header: 'Impact Strength', key: 'impactStrength', width: 18 },
      { header: 'Probability', key: 'probability', width: 15 },
      { header: 'ROAM Status', key: 'roaming', width: 15 },
      { header: 'Actions', key: 'actions', width: 35 },
      { header: 'Owner', key: 'owner', width: 15 },
      { header: 'Created', key: 'created', width: 12 },
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Helper function to get color for risk level (pastel colors for better readability)
    const getColorForValue = (value: string) => {
      const lowerValue = value.toLowerCase();
      
      if (lowerValue === 'high') {
        return { 
          bg: 'FFFEE2E2',  // Light rose/pink (Tailwind rose-100)
          text: 'FF991B1B'  // Dark red text
        };
      }
      
      if (lowerValue === 'medium') {
        return { 
          bg: 'FFFEF3C7',  // Light amber/yellow (Tailwind amber-100)
          text: 'FF92400E'  // Dark brown text
        };
      }
      
      if (lowerValue === 'low') {
        return { 
          bg: 'FFD1F4E0',  // Light mint/green (Tailwind emerald-100)
          text: 'FF0F6938'  // Dark green text
        };
      }
      
      return { 
        bg: 'FFFFFFFF',  // White background
        text: 'FF000000'  // Black text
      };
    };

    // Add data rows
    risks.forEach((risk) => {
      const impactValue = risk.impactStrength 
        ? risk.impactStrength.charAt(0).toUpperCase() + risk.impactStrength.slice(1)
        : '-';
      const probValue = risk.probability
        ? risk.probability.charAt(0).toUpperCase() + risk.probability.slice(1)
        : '-';

      const row = worksheet.addRow({
        task: risk.task || '-',
        risk: risk.risk,
        impact: risk.impact || '-',
        impactStrength: impactValue,
        probability: probValue,
        roaming: risk.roaming
          ? risk.roaming.charAt(0).toUpperCase() + risk.roaming.slice(1)
          : 'None',
        actions: risk.actions || '-',
        owner: risk.owner || '-',
        created: new Date(risk.createdAt).toLocaleDateString(),
      });

      // Apply color to Impact Strength cell (column 4)
      const impactColors = getColorForValue(impactValue);
      row.getCell(4).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: impactColors.bg }
      };
      row.getCell(4).font = {
        bold: true,
        color: { argb: impactColors.text }
      };
      row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };

      // Apply color to Probability cell (column 5)
      const probColors = getColorForValue(probValue);
      row.getCell(5).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: probColors.bg }
      };
      row.getCell(5).font = {
        bold: true,
        color: { argb: probColors.text }
      };
      row.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Generate filename with current date
    const fileName = `PM-Tools_Risks_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Write to buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);

    // Show success toast notification
    toast({
      title: "Export successful",
      description: `${risks.length} risk${risks.length === 1 ? '' : 's'} exported to ${fileName}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Main content */}
      <main className="flex-1">
        <div className="container mx-auto px-6 max-w-7xl py-6">
        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button variant="outline" onClick={exportToExcel}>
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
