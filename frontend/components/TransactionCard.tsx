import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Transaction } from '../types';
import { useExpense } from '../context/ExpenseContext';

interface Props {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: Props) {
  const { deleteTransaction } = useExpense();
  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteTransaction(transaction.id) }
      ]
    );
  };

  return (
    <TouchableOpacity 
      onLongPress={handleDelete} 
      className="flex-row justify-between items-center bg-cardBackground p-4 my-2 mx-4 rounded-xl shadow-sm elevation-sm"
    >
      <View className="flex-row items-center">
        <View className={`w-10 h-10 rounded-full mr-3 opacity-20 ${isIncome ? 'bg-success' : 'bg-danger'}`} />
        <View>
          <Text className="text-base font-semibold text-text">{transaction.description}</Text>
          <Text className="text-xs text-textLight mt-1">{transaction.category} • {transaction.date}</Text>
        </View>
      </View>
      <Text className={`text-base font-bold ${isIncome ? 'text-success' : 'text-text'}`}>
        {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
}
