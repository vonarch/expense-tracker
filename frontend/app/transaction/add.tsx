import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useExpense } from '../../context/ExpenseContext';
import { useRouter } from 'expo-router';

export default function AddTransactionScreen() {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  
  const { addTransaction } = useExpense();
  const router = useRouter();

  const handleSave = () => {
    if (!description || !amount || !category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    addTransaction({
      description,
      amount: parseFloat(amount),
      category,
      type
    });
    
    router.back();
  };

  return (
    <View className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold text-text mb-6 mt-4">Add Transaction</Text>
      
      <View className="flex-row mb-6 bg-cardBackground rounded-lg p-1">
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-md items-center ${type === 'expense' ? 'bg-danger' : 'bg-transparent'}`}
          onPress={() => setType('expense')}
        >
          <Text className={`font-medium ${type === 'expense' ? 'text-white' : 'text-textLight'}`}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-md items-center ${type === 'income' ? 'bg-success' : 'bg-transparent'}`}
          onPress={() => setType('income')}
        >
          <Text className={`font-medium ${type === 'income' ? 'text-white' : 'text-textLight'}`}>Income</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        className="bg-white px-4 py-3 rounded-lg mb-4 text-text border border-border"
        placeholder="Description (e.g. Lunch)"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        className="bg-white px-4 py-3 rounded-lg mb-4 text-text border border-border"
        placeholder="Amount (e.g. 15.00)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        className="bg-white px-4 py-3 rounded-lg mb-8 text-text border border-border"
        placeholder="Category (e.g. Food)"
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity 
        className="bg-primary py-4 rounded-xl items-center"
        onPress={handleSave}
      >
        <Text className="text-white text-base font-bold">Save Transaction</Text>
      </TouchableOpacity>
    </View>
  );
}
