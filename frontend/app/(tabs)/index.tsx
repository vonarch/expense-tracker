import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useExpense } from '../../context/ExpenseContext';
import TransactionCard from '../../components/TransactionCard';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const { transactions } = useExpense();
  const router = useRouter();

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const recentTransactions = transactions.slice(0, 3);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1">
        <View className="px-5 pt-12 pb-8 flex-row justify-between items-center bg-primary rounded-b-3xl shadow-md">
          <View>
            <Text className="text-white/80 text-sm font-medium">Welcome back,</Text>
            <Text className="text-white text-2xl font-bold">{user?.name || 'User'}!</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} className="bg-white/20 px-4 py-2 rounded-full">
            <Text className="text-white font-medium text-sm">Logout</Text>
          </TouchableOpacity>
        </View>

        <View className="px-4 -mt-5">
          <View className="bg-cardBackground p-5 rounded-2xl shadow-sm elevation-sm border border-border/50">
            <Text className="text-textLight text-sm font-medium mb-1">Total Balance</Text>
            <Text className="text-3xl font-bold text-text mb-4">${balance.toFixed(2)}</Text>
            
            <View className="flex-row justify-between pt-4 border-t border-border/50">
              <View>
                <Text className="text-textLight text-xs mb-1">Income</Text>
                <Text className="text-success font-semibold text-base">+${totalIncome.toFixed(2)}</Text>
              </View>
              <View className="items-end">
                <Text className="text-textLight text-xs mb-1">Expenses</Text>
                <Text className="text-danger font-semibold text-base">-${totalExpense.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-4 mt-8 flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold text-text">Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
            <Text className="text-primary font-medium text-sm">See All</Text>
          </TouchableOpacity>
        </View>

        <View className="pb-24">
          {recentTransactions.map(t => (
            <TransactionCard key={t.id} transaction={t} />
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity 
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg elevation-lg"
        onPress={() => router.push('/transaction/add')}
      >
        <Text className="text-white text-3xl font-light -mt-1">+</Text>
      </TouchableOpacity>
    </View>
  );
}
