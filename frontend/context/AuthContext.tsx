import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { apiFetch, setAuthToken, ApiError } from '../services/api';

const TOKEN_KEY = 'expense_tracker_token';

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = useCallback(async (token: string, nextUser: User) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    setAuthToken(token);
    setUser(nextUser);
  }, []);

  const clearSession = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (!token) return;

        setAuthToken(token);
        const data = await apiFetch<{ user: User }>('/auth/me');
        setUser(data.user);
      } catch {
        await clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, [clearSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await apiFetch<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      await persistSession(data.token, data.user);
    },
    [persistSession]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const data = await apiFetch<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      await persistSession(data.token, data.user);
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    await clearSession();
  }, [clearSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export { ApiError };
