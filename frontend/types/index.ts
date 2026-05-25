export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export type DatePeriod = 'day' | 'week' | 'month' | 'year';

export interface CategoryBreakdown {
  category: string;
  total: number;
}

export interface DashboardStats {
  balance: number;
  monthIncome: number;
  monthExpense: number;
  categoryBreakdown: CategoryBreakdown[];
  recentTransactions: Transaction[];
}
