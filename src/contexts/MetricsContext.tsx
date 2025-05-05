'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface BasicMetrics {
  idMaHV: number;
  Height?: number | null;
  Weight?: number | null;
  BMI?: number | null;
  Chest?: number | null;
  Waist?: number | null;
  hips?: number | null;
  Arm?: number | null;
  Thigh?: number | null;
  Calf?: number | null;
  Mota?: string | null;
  Ten?: string;
}

interface AdvancedMetrics {
  idMaHV: number;
  BodyFatPercent?: number | null;
  MuscleMass?: number | null;
  VisceralFat?: number | null;
  BasalMetabolicRate?: number | null;
  BoneMass?: number | null;
  WaterPercent?: number | null;
  Mota?: string | null;
  Ten?: string;
}

export interface Metrics {
  type: 'basic' | 'advanced';
  data: BasicMetrics | AdvancedMetrics;
  requestedDate?: string;
  defaultQuestion?: string; 
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