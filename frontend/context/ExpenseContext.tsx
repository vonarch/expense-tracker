import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Transaction, Goal } from '../types';

interface ExpenseContextType {
  transactions: Transaction[];
  goals: Goal[];
  deleteTransaction: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  searchTransactions: (query: string) => Transaction[];
  addGoal: (goal: Goal) => void;
}

const mockTransactions: Transaction[] = [
  { id: '1', amount: 50.0, category: 'Food', date: '2026-05-16', description: 'Lunch at Cafe', type: 'expense' },
  { id: '2', amount: 1200.0, category: 'Salary', date: '2026-05-15', description: 'May Salary', type: 'income' },
  { id: '3', amount: 30.0, category: 'Transport', date: '2026-05-14', description: 'Uber ride', type: 'expense' },
  { id: '4', amount: 200.0, category: 'Shopping', date: '2026-05-12', description: 'Groceries', type: 'expense' },
];

const mockGoals: Goal[] = [
  { id: '1', title: 'Vacation Fund', targetAmount: 2000, currentAmount: 850, deadline: '2026-12-01' },
  { id: '2', title: 'New Laptop', targetAmount: 1500, currentAmount: 300, deadline: '2026-09-01' },
];

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [goals, setGoals] = useState<Goal[]>(mockGoals);

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter(t => t.id !== id));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const searchTransactions = (query: string) => {
    if (!query.trim()) return transactions;
    return transactions.filter(t => 
      t.description.toLowerCase().includes(query.toLowerCase()) || 
      t.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  const addGoal = (goal: Goal) => {
    setGoals((prev) => [goal, ...prev]);
  };

  return (
    <ExpenseContext.Provider value={{ transactions, goals, deleteTransaction, addTransaction, searchTransactions, addGoal }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
