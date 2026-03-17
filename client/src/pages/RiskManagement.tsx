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
import { useSettings } from "@/contexts/SettingsContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RiskTable from "@/components/risk-management/RiskTable";
import RiskMatrix from "@/components/risk-management/RiskMatrix";
import RoamBoard from "@/components/risk-management/RoamBoard";
import AddRiskDialog from "@/components/risk-management/AddRiskDialog";
import { AIChatButton } from "@/components/ai-chat/AIChatButton";
import { AIChatPanel } from "@/components/ai-chat/AIChatPanel";
import { ChatMessage } from "@/components/ai-chat/ChatMessage";
import { RiskSelector } from "@/components/ai-chat/RiskSelector";
import { aiService } from "@/services/aiService";
import { ChatMessage as ChatMessageType, AIAction } from "@/types/ai";
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
  const { aiEnabled } = useSettings();
  
  // AI Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>(() => {
    // Restore from localStorage on mount
    try {
      const saved = localStorage.getItem('ai-chat-history');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if it's an array and not older than 7 days
        if (Array.isArray(parsed) && parsed.length > 0) {
          const lastMessage = parsed[parsed.length - 1];
          if (lastMessage.timestamp) {
            const lastMessageDate = new Date(lastMessage.timestamp);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            if (lastMessageDate > weekAgo) {
              // Restore history in aiService as well
              aiService.restoreHistory(parsed);
              return parsed;
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
    return [];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [showRiskSelector, setShowRiskSelector] = useState(false);

  // Save chat messages to localStorage whenever they change
  useEffect(() => {
    if (chatMessages.length > 0) {
      try {
        localStorage.setItem('ai-chat-history', JSON.stringify(chatMessages));
      } catch (error) {
        console.error('Failed to save chat history:', error);
        // If quota exceeded - keep only last 20 messages
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          const recent = chatMessages.slice(-20);
          setChatMessages(recent);
          localStorage.setItem('ai-chat-history', JSON.stringify(recent));
        }
      }
    } else {
      localStorage.removeItem('ai-chat-history');
    }
  }, [chatMessages]);

  // Sync AI service mode with settings
  useEffect(() => {
    // When AI is enabled in settings, use real Claude API (useMock = false)
    // When AI is disabled, use mock (though button will be hidden anyway)
    aiService.setUseMock(!aiEnabled);
  }, [aiEnabled]);

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

  /**
   * Handle AI action button clicks
   */
  const handleAIAction = async (action: AIAction) => {
    switch (action.type) {
      case 'add_risks':
        await handleAddRisks(action.data);
        break;
      
      case 'add_mitigation':
        await handleAddMitigation(action.data);
        break;
      
      case 'analyze':
        await handleAnalyze();
        break;
      
      case 'navigate':
        handleNavigate(action.data);
        break;
      
      default:
        console.warn('Unknown action type:', action.type);
    }
  };

  /**
   * Add risks to table
   */
  const handleAddRisks = async (data: any) => {
    const lastAIMessage = [...chatMessages]
      .reverse()
      .find(m => m.role === 'assistant' && 'data' in m && m.data?.risks);

    if (!lastAIMessage || !('data' in lastAIMessage) || !lastAIMessage.data?.risks) {
      toast({
        title: 'Error',
        description: 'No risks found to add',
        variant: 'destructive',
      });
      return;
    }

    // Add all risks (selection mode removed since button is gone)
    const risksToAdd = lastAIMessage.data.risks.map(r => ({
      task: r.task || '',
      risk: r.risk,
      impact: r.impact || '',
      impactStrength: r.impactStrength || null,
      probability: r.probability || null,
      roaming: null,
      actions: '',
      owner: undefined,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    setRisks([...risks, ...risksToAdd]);

    toast({
      title: 'Risks added',
      description: `Added ${risksToAdd.length} risks to your table`,
    });

    const successMessage: ChatMessageType = {
      role: 'assistant',
      message: `✅ Done! Added ${risksToAdd.length} risks to your table.\n\n🤖 What's next?`,
      actions: [
        {
          type: 'analyze',
          label: '🔍 Analyze these risks',
          data: {},
          variant: 'default',
          icon: '🔍',
        },
        {
          type: 'navigate',
          label: '💡 Suggest mitigation',
          data: { view: 'mitigate' },
          variant: 'secondary',
          icon: '💡',
        },
      ],
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, successMessage]);
  };

  /**
   * Add mitigation to risk
   */
  const handleAddMitigation = async (data: any) => {
    const { riskId, actions: mitigationActions } = data;

    updateRisk(riskId, {
      actions: mitigationActions.join('\n• '),
      roaming: 'mitigated',
    });

    toast({
      title: 'Mitigation added',
      description: 'Action plan added to risk',
    });

    const successMessage: ChatMessageType = {
      role: 'assistant',
      message: '✅ Mitigation plan added!\n\n🤖 What would you like to do next?',
      actions: [
        {
          type: 'navigate',
          label: '➡️ Suggest for another risk',
          data: { action: 'mitigate_next' },
          variant: 'default',
        },
      ],
      timestamp: new Date(),
    };

    setChatMessages([...chatMessages, successMessage]);
  };

  /**
   * Analyze risks
   */
  const handleAnalyze = async () => {
    if (risks.length === 0) {
      // Show message in chat instead of just toast
      const errorMessage: ChatMessageType = {
        role: 'assistant',
        message: '⚠️ You don\'t have any risks yet.\n\nI can\'t analyze an empty table. Let\'s start by generating some risks for your project.',
        actions: [
          {
            type: 'navigate',
            label: '✨ Generate risks',
            data: { view: 'generate' },
            variant: 'default',
            icon: '✨',
          },
        ],
        timestamp: new Date(),
      };
      
      setChatMessages(prev => [...prev, errorMessage]);
      return;
    }

    setIsAILoading(true);

    try {
      const response = await aiService.analyzeRisks(risks);
      setChatMessages(prev => [...prev, response]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze risks',
        variant: 'destructive',
      });
    } finally {
      setIsAILoading(false);
    }
  };

  /**
   * Navigate between views - in continuous dialog, just triggers actions
   */
  const handleNavigate = (data: any) => {
    if (data.view === 'generate') {
      handleSelectAction('generate');
    } else if (data.view === 'analyze') {
      handleSelectAction('analyze');
    } else if (data.view === 'mitigate') {
      handleSelectAction('mitigate');
    } else if (data.action === 'mitigate_critical') {
      // Suggest mitigation for critical risks
      handleSelectAction('mitigate');
    } else if (data.action === 'regenerate') {
      // User wants to generate different risks
      const regenerateMessage: ChatMessageType = {
        role: 'assistant',
        message: 'Sure! Tell me more about your project to generate different risks:\n• Any specific areas of concern?\n• Changed requirements?\n• Different focus areas?',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, regenerateMessage]);
    } else if (data.action === 'help') {
      // Show help
      handleSendMessage('help');
    }
    // Ignore 'welcome' navigation - we don't have a welcome screen anymore
  };

  /**
   * Handle quick action selection from Quick Actions bar
   */
  const handleSelectAction = async (action: 'generate' | 'analyze' | 'mitigate') => {
    console.log('[AI Chat] Quick action selected:', action);

    if (action === 'generate') {
      const promptMessage: ChatMessageType = {
        role: 'assistant',
        message: 'Great! Tell me about your project:\n• What are you building?\n• What\'s your timeline?\n• Any specific concerns?',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, promptMessage]);
    } else if (action === 'analyze') {
      await handleAnalyze();
    } else if (action === 'mitigate') {
      if (risks.length === 0) {
        const errorMessage: ChatMessageType = {
          role: 'assistant',
          message: '⚠️ You don\'t have any risks yet.\n\nLet\'s start by generating some risks for your project.',
          actions: [
            {
              type: 'navigate',
              label: '✨ Generate risks',
              data: { view: 'generate' },
              variant: 'default',
            },
          ],
          timestamp: new Date(),
        };
        setChatMessages(prev => [...prev, errorMessage]);
      } else {
        // Show risk selector modal (all risks selected by default)
        setShowRiskSelector(true);
      }
    }
  };

  /**
   * Handle free-form message send
   */
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: ChatMessageType = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    const lastMessage = chatMessages[chatMessages.length - 1];
    const isGenerateFlow = lastMessage?.role === 'assistant' && 
      lastMessage.message.includes('Tell me about your project');

    setIsAILoading(true);

    try {
      let response;
      
      if (isGenerateFlow) {
        response = await aiService.generateRisks(message);
      } else {
        response = await aiService.chat(message, { risks });
      }

      setChatMessages(prev => [...prev, response]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get AI response',
        variant: 'destructive',
      });
    } finally {
      setIsAILoading(false);
    }
  };

  /**
   * Handle clearing chat history
   */
  const handleClearHistory = () => {
    if (confirm('Clear all chat history? This cannot be undone.')) {
      setChatMessages([]);
      localStorage.removeItem('ai-chat-history');
      aiService.clearHistory();
      toast({
        title: 'History cleared',
        description: 'Chat history has been cleared',
      });
    }
  };

  /**
   * Handle risk selection confirmation for mitigation
   */
  const handleRiskSelectionConfirm = async (selectedRisks: Risk[]) => {
    // Add user message
    const userMessage: ChatMessageType = {
      role: 'user',
      content: `Suggest mitigation for ${selectedRisks.length} risk${selectedRisks.length > 1 ? 's' : ''}`,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, userMessage]);

    setIsAILoading(true);

    try {
      const response = await aiService.suggestMitigationMultiple(selectedRisks);
      setChatMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('[AI Chat] Mitigation error:', error);
      toast({
        title: 'Error',
        description: 'Failed to suggest mitigation',
        variant: 'destructive',
      });
    } finally {
      setIsAILoading(false);
    }
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
      
      {/* AI Chat */}
      {aiEnabled && (
        <AIChatButton 
          onClick={() => setIsChatOpen(true)}
          suggestionsCount={0}
        />
      )}
      
      <AIChatPanel 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        onSendMessage={handleSendMessage}
        onQuickAction={handleSelectAction}
        onClearHistory={handleClearHistory}
        inputValue={inputMessage}
        onInputChange={setInputMessage}
        messagesCount={chatMessages.length}
      >
        {chatMessages.map((msg, i) => (
          <ChatMessage 
            key={i} 
            message={msg}
            onAction={handleAIAction}
          />
        ))}
        
        {isAILoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground text-sm">🤖</span>
            </div>
            <div className="flex-1">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Thinking...</p>
              </div>
            </div>
          </div>
        )}
      </AIChatPanel>
      
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

      {/* Risk Selector Modal */}
      <RiskSelector
        risks={risks}
        open={showRiskSelector}
        onClose={() => setShowRiskSelector(false)}
        onConfirm={handleRiskSelectionConfirm}
      />
    </div>
  );
}
