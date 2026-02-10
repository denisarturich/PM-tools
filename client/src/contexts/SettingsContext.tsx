import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SettingsContextType {
  aiEnabled: boolean;
  setAIEnabled: (enabled: boolean) => void;
  serverAIEnabled: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Server-side AI feature flag (from AI_FEATURE_ENABLED env var)
  const [serverAIEnabled, setServerAIEnabled] = useState<boolean>(true);
  
  // User preference (from localStorage)
  const [userAIEnabled, setUserAIEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('settings:aiEnabled');
    return saved !== null ? JSON.parse(saved) : true; // Default: enabled
  });

  // Check server AI status on mount
  useEffect(() => {
    fetch('/api/ai-status')
      .then(res => res.json())
      .then(data => {
        setServerAIEnabled(data.enabled);
      })
      .catch(error => {
        console.error('Failed to check AI feature status:', error);
        // Default to false if server check fails
        setServerAIEnabled(false);
      });
  }, []);

  // Save user preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem('settings:aiEnabled', JSON.stringify(userAIEnabled));
  }, [userAIEnabled]);

  // AI is enabled only if BOTH server allows it AND user enabled it
  const aiEnabled = serverAIEnabled && userAIEnabled;

  const value = {
    aiEnabled,
    setAIEnabled: setUserAIEnabled,
    serverAIEnabled,
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
