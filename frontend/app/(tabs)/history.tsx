import React from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useExpense } from '../../context/ExpenseContext';
import TransactionCard from '../../components/TransactionCard';

export default function HistoryScreen() {
  const { transactions } = useExpense();
  const router = useRouter();
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row justify-between items-center mx-4 mt-5 mb-1">
        <Text className="text-2xl font-bold text-text">Transaction History</Text>
        <TouchableOpacity onPress={() => router.push('/search')}>
          <Text className="text-primary font-semibold">Search</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-sm text-textLight mx-4 mb-3">Long press any transaction to delete it.</Text>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionCard transaction={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
