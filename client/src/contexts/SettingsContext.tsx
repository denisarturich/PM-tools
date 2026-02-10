import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  aiEnabled: boolean;
  setAIEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [aiEnabled, setAIEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('settings:aiEnabled');
    return saved !== null ? JSON.parse(saved) : true; // Default: enabled
  });

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('settings:aiEnabled', JSON.stringify(aiEnabled));
  }, [aiEnabled]);

  const value = {
    aiEnabled,
    setAIEnabled,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
