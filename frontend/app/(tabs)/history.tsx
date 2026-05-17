import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { useExpense } from '../../context/ExpenseContext';
import TransactionCard from '../../components/TransactionCard';

export default function HistoryScreen() {
  const { transactions } = useExpense();

  return (
    <View className="flex-1 bg-background">
      <Text className="text-2xl font-bold mx-4 mt-5 mb-1 text-text">Transaction History</Text>
      <Text className="text-sm text-textLight mx-4 mb-3">Long press any transaction to delete it.</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionCard transaction={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
