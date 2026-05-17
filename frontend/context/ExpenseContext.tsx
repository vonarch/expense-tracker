import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Transaction } from '../types';
import { useAuth } from './AuthContext';
import { Alert } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

interface ExpenseContextType {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'date'>) => Promise<boolean>;
  deleteTransaction: (id: string | number) => Promise<boolean>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredTransactions: Transaction[];
  fetchTransactions: () => Promise<void>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { token, user } = useAuth();

  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/api/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        // Map database IDs to strings to ensure compatibility across app
        const formattedData = data.map((t: any) => ({ ...t, id: String(t.id) }));
        setTransactions(formattedData);
      }
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchTransactions();
    } else {
      setTransactions([]); // Clear on logout
    }
  }, [token, fetchTransactions]);

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'date'>) => {
    if (!token) return false;
    try {
      const response = await fetch(`${API_URL}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tx)
      });
      
      const newTx = await response.json();
      if (response.ok) {
        setTransactions([{ ...newTx, id: String(newTx.id) }, ...transactions]);
        return true;
      }
      return false;
    } catch (e) {
      Alert.alert('Error', 'Failed to add transaction');
      return false;
    }
  };

  const deleteTransaction = async (id: string | number) => {
    if (!token) return false;
    try {
      const response = await fetch(`${API_URL}/api/transactions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        setTransactions(transactions.filter(t => String(t.id) !== String(id)));
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ExpenseContext.Provider value={{
      transactions,
      addTransaction,
      deleteTransaction,
      searchQuery,
      setSearchQuery,
      filteredTransactions,
      fetchTransactions
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) throw new Error('useExpense must be used within ExpenseProvider');
  return context;
};
