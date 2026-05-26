import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TourStep = 'add' | 'history' | 'goals' | 'categories' | null;

const key = (userId: number) => `tour_completed_${userId}`;

interface TourContextType {
  step: TourStep;
  start: () => void;
  next: (current: TourStep) => void;
  complete: (userId?: number) => Promise<void>;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<TourStep>(null);

  const start = useCallback(() => setStep('add'), []);

  const next = useCallback((current: TourStep) => {
    if (current === 'add')      setStep('history');
    else if (current === 'history') setStep('goals');
    else if (current === 'goals')   setStep('categories');
    else setStep(null);
  }, []);

  const complete = useCallback(async (userId?: number) => {
    setStep(null);
    if (userId) await AsyncStorage.setItem(key(userId), 'true');
  }, []);

  return (
    <TourContext.Provider value={{ step, start, next, complete }}>
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used within TourProvider');
  return ctx;
}

export async function hasTourCompleted(userId: number): Promise<boolean> {
  const val = await AsyncStorage.getItem(key(userId));
  return val === 'true';
}

export async function resetTour(userId: number): Promise<void> {
  await AsyncStorage.removeItem(key(userId));
}