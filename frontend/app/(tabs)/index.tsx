import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useExpense } from '../../context/ExpenseContext';
import SummaryChart from '../../components/SummaryChart';
import TransactionCard from '../../components/TransactionCard';
import GoalCard from '../../components/GoalCard';
import { formatCurrency } from '../../utils/formatters';

export default function DashboardScreen() {
  const router = useRouter();
  const { getDashboardStats, goals } = useExpense();
  const stats = getDashboardStats();
  const topGoals = goals.slice(0, 2);

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 24 }}>
      <Text className="text-2xl font-bold mx-4 mt-5 text-text">Dashboard</Text>
      <Text className="text-sm text-textLight mx-4 mb-4">Your financial overview</Text>

      <View className="bg-primary mx-4 p-5 rounded-2xl mb-4">
        <Text className="text-white/80 text-sm">Total Balance</Text>
        <Text className="text-white text-3xl font-bold mt-1">
          {formatCurrency(stats.balance)}
        </Text>
        <View className="flex-row mt-4 gap-6">
          <View>
            <Text className="text-white/70 text-xs">Income (month)</Text>
            <Text className="text-success text-base font-semibold mt-0.5">
              +{formatCurrency(stats.monthIncome)}
            </Text>
          </View>
          <View>
            <Text className="text-white/70 text-xs">Expenses (month)</Text>
            <Text className="text-danger text-base font-semibold mt-0.5">
              -{formatCurrency(stats.monthExpense)}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row mx-4 mb-4 gap-2">
        <TouchableOpacity
          onPress={() => router.push('/search')}
          className="flex-1 bg-cardBackground py-3 rounded-xl items-center border border-border"
        >
          <Text className="text-primary font-semibold">Search</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/transaction/add')}
          className="flex-1 bg-cardBackground py-3 rounded-xl items-center border border-border"
        >
          <Text className="text-primary font-semibold">Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/settings')}
          className="flex-1 bg-cardBackground py-3 rounded-xl items-center border border-border"
        >
          <Text className="text-primary font-semibold">Export</Text>
        </TouchableOpacity>
      </View>

      <SummaryChart data={stats.categoryBreakdown} title="This Month's Spending" />

      {topGoals.length > 0 && (
        <View className="mt-4">
          <View className="flex-row justify-between items-center mx-4 mb-1">
            <Text className="text-lg font-semibold text-text">Goals</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/goals')}>
              <Text className="text-sm text-primary">See all</Text>
            </TouchableOpacity>
          </View>
          {topGoals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </View>
      )}

      <View className="mt-4">
        <View className="flex-row justify-between items-center mx-4 mb-2">
          <Text className="text-lg font-semibold text-text">Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
            <Text className="text-sm text-primary">View all</Text>
          </TouchableOpacity>
        </View>
        {stats.recentTransactions.length === 0 ? (
          <Text className="text-center text-textLight mx-4">No transactions yet.</Text>
        ) : (
          stats.recentTransactions.map((tx) => (
            <TransactionCard key={tx.id} transaction={tx} />
          ))
        )}
      </View>
    </ScrollView>
  );
}
