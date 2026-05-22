import React, { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { Transaction, Goal, DatePeriod, DashboardStats } from '../types';
import { filterTransactionsByPeriod, isInPeriod } from '../utils/exportData';
import { generateId } from '../utils/formatters';

interface ExpenseContextType {
  transactions: Transaction[];
  goals: Goal[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  searchTransactions: (query: string) => Transaction[];
  getTransactionsByPeriod: (period: DatePeriod, referenceDate?: Date) => Transaction[];
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
  updateGoalProgress: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  getDashboardStats: () => DashboardStats;
}

const mockTransactions: Transaction[] = [
  { id: '1', amount: 50.0, category: 'Food', date: '2026-05-16', description: 'Lunch at Cafe', type: 'expense' },
  { id: '2', amount: 1200.0, category: 'Salary', date: '2026-05-15', description: 'May Salary', type: 'income' },
  { id: '3', amount: 30.0, category: 'Transport', date: '2026-05-14', description: 'Uber ride', type: 'expense' },
  { id: '4', amount: 200.0, category: 'Shopping', date: '2026-05-12', description: 'Groceries', type: 'expense' },
  { id: '5', amount: 85.0, category: 'Bills', date: '2026-05-10', description: 'Electric bill', type: 'expense' },
  { id: '6', amount: 45.0, category: 'Food', date: '2026-05-08', description: 'Dinner', type: 'expense' },
  { id: '7', amount: 150.0, category: 'Freelance', date: '2026-04-28', description: 'Side project', type: 'income' },
];

const mockGoals: Goal[] = [
  { id: '1', title: 'Vacation Fund', targetAmount: 2000, currentAmount: 850, deadline: '2026-12-01' },
  { id: '2', title: 'New Laptop', targetAmount: 1500, currentAmount: 300, deadline: '2026-09-01' },
];

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = React.useState<Transaction[]>(mockTransactions);
  const [goals, setGoals] = React.useState<Goal[]>(mockGoals);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
    setTransactions((prev) => [{ ...transaction, id: generateId() }, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
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

  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'currentAmount'>) => {
    setGoals((prev) => [{ ...goal, id: generateId(), currentAmount: 0 }, ...prev]);
  }, []);

  const updateGoalProgress = useCallback((id: string, amount: number) => {
    if (amount <= 0) return;
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, currentAmount: Math.min(g.currentAmount + amount, g.targetAmount) }
          : g
      )
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
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
      addTransaction,
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
      addTransaction,
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
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
