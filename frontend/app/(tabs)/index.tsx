import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useExpense } from '../../context/ExpenseContext';
import { useAuth } from '../../context/AuthContext';
import { useTour } from '../../context/TourContext';
import TourTooltip from '../../components/TourTooltip';
import SummaryChart from '../../components/SummaryChart';
import TransactionCard from '../../components/TransactionCard';
import GoalCard from '../../components/GoalCard';
import { formatCurrency } from '../../utils/formatters';

export default function DashboardScreen() {
  const router = useRouter();
  const { tour } = useLocalSearchParams<{ tour?: string }>();
  const { user } = useAuth();
  const { getDashboardStats, goals, isLoading } = useExpense();
  const { step, start, next, complete } = useTour();

  useEffect(() => {
    if (tour === '1') start();
  }, [tour]);
  const stats = getDashboardStats();
  const topGoals = goals.slice(0, 2);

  const goToHistory = () => {
    next('add');
    router.push({ pathname: '/(tabs)/history', params: { tour: '1' } });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

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

        <TourTooltip
          visible={step === 'add'}
          title="Add a Transaction"
          body={'Tap "Add" to log any income or expense. Choose a category, enter the amount, and save — it appears instantly in your dashboard and history.'}
          stepLabel="1 of 4"
          anchorTop={230}
          onNext={goToHistory}
          onSkip={complete}
        />
        
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
