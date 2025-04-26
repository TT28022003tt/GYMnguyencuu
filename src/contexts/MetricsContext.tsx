'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Metrics {
  type: 'basic' | 'advanced';
  data: any; 
}

interface MetricsContextType {
  selectedMetrics: Metrics | null;
  setSelectedMetrics: (metrics: Metrics | null) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export function MetricsProvider({ children }: { children: ReactNode }) {
  const [selectedMetrics, setSelectedMetrics] = useState<Metrics | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <MetricsContext.Provider value={{ selectedMetrics, setSelectedMetrics, isChatOpen, setIsChatOpen }}>
      {children}
    </MetricsContext.Provider>
  );
}

export function useMetrics() {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
}