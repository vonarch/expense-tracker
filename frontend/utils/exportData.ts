import { Share, Alert } from 'react-native';
import { Transaction, DatePeriod } from '../types';
import { parseDate } from './formatters';

export function isInPeriod(
  dateStr: string,
  period: DatePeriod,
  referenceDate: Date = new Date()
): boolean {
  const date = parseDate(dateStr);
  const ref = new Date(referenceDate);
  ref.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  switch (period) {
    case 'day':
      return date.getTime() === ref.getTime();
    case 'week': {
      const start = getWeekStart(ref);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return date >= start && date <= end;
    }
    case 'month':
      return (
        date.getMonth() === ref.getMonth() &&
        date.getFullYear() === ref.getFullYear()
      );
    case 'year':
      return date.getFullYear() === ref.getFullYear();
    default:
      return false;
  }
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function filterTransactionsByPeriod(
  transactions: Transaction[],
  period: DatePeriod,
  referenceDate: Date = new Date()
): Transaction[] {
  return transactions
    .filter((t) => isInPeriod(t.date, period, referenceDate))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function transactionsToCsv(transactions: Transaction[]): string {
  const header = 'Date,Type,Category,Description,Amount';
  const rows = transactions.map((t) => {
    const desc = `"${t.description.replace(/"/g, '""')}"`;
    return `${t.date},${t.type},${t.category},${desc},${t.amount.toFixed(2)}`;
  });
  return [header, ...rows].join('\n');
}

export async function exportTransactions(
  transactions: Transaction[],
  period: DatePeriod
): Promise<void> {
  if (transactions.length === 0) {
    Alert.alert('No Data', 'No transactions found for the selected period.');
    return;
  }

  const periodLabel = period.charAt(0).toUpperCase() + period.slice(1);
  const csv = transactionsToCsv(transactions);
  const summary = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') acc.income += t.amount;
      else acc.expense += t.amount;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const message = [
    `Expense Tracker Export (${periodLabel})`,
    `Transactions: ${transactions.length}`,
    `Total Income: $${summary.income.toFixed(2)}`,
    `Total Expenses: $${summary.expense.toFixed(2)}`,
    `Net: $${(summary.income - summary.expense).toFixed(2)}`,
    '',
    '--- CSV Data ---',
    csv,
  ].join('\n');

  try {
    await Share.share({
      message,
      title: `Transactions Export (${periodLabel})`,
    });
  } catch {
    Alert.alert('Export Failed', 'Could not share the export. Please try again.');
  }
}
