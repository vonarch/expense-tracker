import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useExpense } from '../../context/ExpenseContext';
import FilterModal from '../../components/FilterModal';
import { DatePeriod } from '../../types';
import { DATE_PERIOD_LABELS } from '../../constants/Tags';
import { exportTransactions } from '../../utils/exportData';
import { formatCurrency } from '../../utils/formatters';

export default function SettingsScreen() {
  const { getTransactionsByPeriod } = useExpense();
  const [period, setPeriod] = useState<DatePeriod>('month');
  const [modalVisible, setModalVisible] = useState(false);

  const filtered = getTransactionsByPeriod(period);
  const income = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const handleExport = async () => {
    await exportTransactions(filtered, period);
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 32 }}>
      <Text className="text-2xl font-bold mx-4 mt-5 text-text">Settings</Text>
      <Text className="text-sm text-textLight mx-4 mb-6">Export and manage your data</Text>

      <View className="bg-cardBackground mx-4 p-4 rounded-xl mb-4">
        <Text className="text-lg font-semibold text-text mb-1">Export Transactions</Text>
        <Text className="text-sm text-textLight mb-4">
          Export transactions filtered by day, week, month, or year. Share as CSV via your
          device's share menu.
        </Text>

        <Text className="text-sm font-medium text-text mb-2">Time period</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-background border border-border rounded-lg px-4 py-3 mb-4"
        >
          <Text className="text-base text-text">{DATE_PERIOD_LABELS[period]}</Text>
        </TouchableOpacity>

        <View className="bg-background rounded-lg p-3 mb-4">
          <Text className="text-sm text-textLight">
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} in this period
          </Text>
          <Text className="text-sm text-text mt-1">
            Income: {formatCurrency(income)} · Expenses: {formatCurrency(expense)}
          </Text>
          <Text className="text-sm font-medium text-text mt-1">
            Net: {formatCurrency(income - expense)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleExport}
          className="bg-primary py-3 rounded-lg items-center"
        >
          <Text className="text-white font-semibold text-base">Export & Share</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-cardBackground mx-4 p-4 rounded-xl">
        <Text className="text-base font-semibold text-text mb-2">About</Text>
        <Text className="text-sm text-textLight leading-5">
          Expense Tracker helps you track income and expenses, set savings goals, and export
          reports by day, week, month, or year.
        </Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              'Tips',
              '• Long-press a transaction in History to delete it\n• Tap a goal to add funds\n• Long-press a goal to delete it'
            )
          }
          className="mt-3"
        >
          <Text className="text-sm text-primary">View tips</Text>
        </TouchableOpacity>
      </View>

      <FilterModal
        visible={modalVisible}
        selected={period}
        onSelect={setPeriod}
        onClose={() => setModalVisible(false)}
        title="Export Period"
      />
    </ScrollView>
  );
}
