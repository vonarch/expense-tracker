import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';

const key = (userId: number) => `onboarded_${userId}`;

export function useOnboarding() {
  const hasCompleted = useCallback(
    async (userId: number): Promise<boolean> => {
      const val = await AsyncStorage.getItem(key(userId));
      return val === 'true';
    },
    []
  );

  const markCompleted = useCallback(async (userId: number): Promise<void> => {
    await AsyncStorage.setItem(key(userId), 'true');
  }, []);

  const reset = useCallback(async (userId: number): Promise<void> => {
    await AsyncStorage.removeItem(key(userId));
  }, []);

  const resetAll = useCallback(async (userId: number): Promise<void> => {
    await AsyncStorage.removeItem(key(userId));
    await AsyncStorage.removeItem(`tour_completed_${userId}`);
  }, []);

  return { hasCompleted, markCompleted, reset, resetAll };
}
