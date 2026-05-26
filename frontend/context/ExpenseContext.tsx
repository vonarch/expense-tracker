import React, {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from 'react';
import {
  Transaction,
  Goal,
  DatePeriod,
  DashboardStats,
  Category,
} from '../types';
import { filterTransactionsByPeriod, isInPeriod } from '../utils/exportData';
import { useAuth } from './AuthContext';
import { apiFetch } from '../services/api';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/Tags';

interface ExpenseContextType {
  transactions: Transaction[];
  goals: Goal[];
  categories: Category[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  getCategoriesByType: (type: 'income' | 'expense') => string[];
  addCategory: (name: string, type: 'income' | 'expense') => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  searchTransactions: (query: string) => Transaction[];
  getTransactionsByPeriod: (period: DatePeriod, referenceDate?: Date) => Transaction[];
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => Promise<void>;
  updateGoalProgress: (id: string, amount: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  getDashboardStats: () => DashboardStats;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

async function seedMissingCategories() {
  const existing = await apiFetch<Category[]>('/categories');
  if (existing.length > 0) return;

  const defaults = [
    ...EXPENSE_CATEGORIES.map((name) => ({ name, type: 'expense' as const })),
    ...INCOME_CATEGORIES.map((name) => ({ name, type: 'income' as const })),
  ];

  for (const cat of defaults) {
    try {
      await apiFetch('/categories', {
        method: 'POST',
        body: JSON.stringify(cat),
      });
    } catch {
      // ignore duplicates
    }
  }
}

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = useCallback(async () => {
    if (!isAuthenticated) {
      setTransactions([]);
      setGoals([]);
      setCategories([]);
      return;
    }

    setIsLoading(true);
    try {
      await seedMissingCategories();
      const [txData, goalsData, categoriesData] = await Promise.all([
        apiFetch<Transaction[]>('/transactions'),
        apiFetch<Goal[]>('/goals'),
        apiFetch<Category[]>('/categories'),
      ]);
      setTransactions(txData);
      setGoals(goalsData);
      setCategories(categoriesData);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const getCategoriesByType = useCallback(
    (type: 'income' | 'expense') =>
      categories.filter((c) => c.type === type).map((c) => c.name),
    [categories]
  );

  const addCategory = useCallback(
    async (name: string, type: 'income' | 'expense') => {
      const created = await apiFetch<Category>('/categories', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), type }),
      });
      setCategories((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    },
    []
  );

  const deleteCategory = useCallback(async (id: number) => {
    await apiFetch(`/categories/${id}`, { method: 'DELETE' });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    const created = await apiFetch<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
    setTransactions((prev) => [created, ...prev]);
  }, []);

  const updateTransaction = useCallback(async (id: string, transaction: Omit<Transaction, 'id'>) => {
    const updated = await apiFetch<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    await apiFetch(`/transactions/${id}`, { method: 'DELETE' });
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const searchTransactions = useCallback(
    (query: string) => {
      const q = query.trim().toLowerCase();
      if (!q) return [...transactions].sort((a, b) => b.date.localeCompare(a.date));
      return transactions
        .filter(
          (t) =>
            t.description.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            t.type.toLowerCase().includes(q) ||
            t.amount.toString().includes(q) ||
            t.date.includes(q)
        )
        .sort((a, b) => b.date.localeCompare(a.date));
    },
    [transactions]
  );

  const getTransactionsByPeriod = useCallback(
    (period: DatePeriod, referenceDate?: Date) =>
      filterTransactionsByPeriod(transactions, period, referenceDate),
    [transactions]
  );

  const addGoal = useCallback(async (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
    const created = await apiFetch<Goal>('/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    });
    setGoals((prev) => [created, ...prev]);
  }, []);

  const updateGoalProgress = useCallback(async (id: string, amount: number) => {
    if (amount <= 0) return;
    const data = await apiFetch<{ goal: Goal; transaction: Transaction }>(
      `/goals/${id}/progress`,
      {
        method: 'PATCH',
        body: JSON.stringify({ amount }),
      }
    );
    setGoals((prev) => prev.map((g) => (g.id === id ? data.goal : g)));
    setTransactions((prev) => [data.transaction, ...prev]);
  }, []);

  const deleteGoal = useCallback(async (id: string) => {
    await apiFetch(`/goals/${id}`, { method: 'DELETE' });
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const getDashboardStats = useCallback((): DashboardStats => {
    const now = new Date();
    const monthTx = transactions.filter((t) => isInPeriod(t.date, 'month', now));

    let monthIncome = 0;
    let monthExpense = 0;
    const categoryMap: Record<string, number> = {};

    monthTx.forEach((t) => {
      if (t.type === 'income') monthIncome += t.amount;
      else {
        monthExpense += t.amount;
        categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      }
    });

    let balance = 0;
    transactions.forEach((t) => {
      balance += t.type === 'income' ? t.amount : -t.amount;
    });

    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total);

    const recentTransactions = [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);

    return {
      balance,
      monthIncome,
      monthExpense,
      categoryBreakdown,
      recentTransactions,
    };
  }, [transactions]);

  const value = useMemo(
    () => ({
      transactions,
      goals,
      categories,
      isLoading,
      refreshData,
      getCategoriesByType,
      addCategory,
      deleteCategory,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      searchTransactions,
      getTransactionsByPeriod,
      addGoal,
      updateGoalProgress,
      deleteGoal,
      getDashboardStats,
    }),
    [
      transactions,
      goals,
      categories,
      isLoading,
      refreshData,
      getCategoriesByType,
      addCategory,
      deleteCategory,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      searchTransactions,
      getTransactionsByPeriod,
      addGoal,
      updateGoalProgress,
      deleteGoal,
      getDashboardStats,
    ]
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
