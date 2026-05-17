import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Transaction } from '../types';
import { Colors } from '../constants/Colors';
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
    <TouchableOpacity onLongPress={handleDelete} style={styles.card}>
      <View style={styles.leftContent}>
        <View style={[styles.iconPlaceholder, { backgroundColor: isIncome ? Colors.success : Colors.danger }]} />
        <View>
          <Text style={styles.description}>{transaction.description}</Text>
          <Text style={styles.category}>{transaction.category} • {transaction.date}</Text>
        </View>
      </View>
      <Text style={[styles.amount, { color: isIncome ? Colors.success : Colors.text }]}>
        {isIncome ? '+' : '-'}${transaction.amount.toFixed(2)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    opacity: 0.2,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  category: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
