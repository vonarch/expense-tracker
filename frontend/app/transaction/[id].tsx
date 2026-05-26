import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useExpense } from '../../context/ExpenseContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ApiError } from '../../context/AuthContext';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { transactions, deleteTransaction } = useExpense();

  const transaction = transactions.find((t) => t.id === id);

  const handleDelete = () => {
    if (!transaction) return;

    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTransaction(transaction.id);
            router.back();
          } catch (err) {
            const message =
              err instanceof ApiError ? err.message : 'Could not delete transaction';
            Alert.alert('Error', message);
          }
        },
      },
    ]);
  };

  if (!transaction) {
    return (
      <>
        <Stack.Screen options={{ title: 'Transaction' }} />
        <View className="flex-1 items-center justify-center bg-background px-6">
          <Text className="text-textLight text-center mb-4">
            Transaction not found. It may have been deleted.
          </Text>
          <TouchableOpacity onPress={() => router.back()} className="bg-primary px-6 py-3 rounded-lg">
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  const isIncome = transaction.type === 'income';

  return (
    <>
      <Stack.Screen options={{ title: 'Transaction Details' }} />
      <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 16 }}>
        <View className="bg-cardBackground rounded-xl p-5 mb-4">
          <Text className="text-sm text-textLight mb-1">Description</Text>
          <Text className="text-xl font-bold text-text mb-4">{transaction.description}</Text>

          <Text
            className={`text-3xl font-bold mb-4 ${isIncome ? 'text-success' : 'text-text'}`}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </Text>

          <View className="border-t border-border pt-4 gap-3">
            <View>
              <Text className="text-xs text-textLight">Type</Text>
              <Text className="text-base text-text capitalize">{transaction.type}</Text>
            </View>
            <View>
              <Text className="text-xs text-textLight">Category</Text>
              <Text className="text-base text-text">{transaction.category}</Text>
            </View>
            <View>
              <Text className="text-xs text-textLight">Date</Text>
              <Text className="text-base text-text">{formatDate(transaction.date)}</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => router.push(`/transaction/edit/${transaction.id}`)}
            className="flex-1 py-3 rounded-lg items-center bg-primary"
          >
            <Text className="text-white font-semibold">Edit Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            className="flex-1 py-3 rounded-lg items-center border border-danger"
          >
            <Text className="text-danger font-semibold">Delete Transaction</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
