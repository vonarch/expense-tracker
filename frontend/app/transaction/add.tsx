import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useExpense } from '../../context/ExpenseContext';
import { toDateString } from '../../utils/formatters';
import { ApiError } from '../../context/AuthContext';

export default function AddTransactionScreen() {
  const router = useRouter();
  const { addTransaction, getCategoriesByType, isLoading } = useExpense();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(toDateString(new Date()));
  const [saving, setSaving] = useState(false);

  const categories = getCategoriesByType(type);

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(category)) {
      setCategory(categories[0]);
    }
  }, [type, categories, category]);

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description.');
      return;
    }
    if (!category) {
      Alert.alert('Error', 'Please select a category.');
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert('Error', 'Date must be in YYYY-MM-DD format.');
      return;
    }

    setSaving(true);
    try {
      await addTransaction({
        amount: parsedAmount,
        category,
        date,
        description: description.trim(),
        type,
      });
      router.back();
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not save transaction';
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading && categories.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Add Transaction' }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 bg-background"
      >
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
          <View className="flex-row mb-4 gap-2">
            {(['expense', 'income'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setType(t)}
                className={`flex-1 py-3 rounded-lg items-center ${
                  type === t ? 'bg-primary' : 'bg-cardBackground border border-border'
                }`}
              >
                <Text className={type === t ? 'text-white font-semibold' : 'text-text'}>
                  {t === 'income' ? 'Income' : 'Expense'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="text-sm font-medium text-text mb-1">Amount (₱)</Text>
          <TextInput
            className="bg-cardBackground border border-border rounded-lg px-4 py-3 mb-4 text-text"
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          <Text className="text-sm font-medium text-text mb-1">Description</Text>
          <TextInput
            className="bg-cardBackground border border-border rounded-lg px-4 py-3 mb-4 text-text"
            placeholder="What was this for?"
            value={description}
            onChangeText={setDescription}
          />

          <Text className="text-sm font-medium text-text mb-2">Category</Text>
          {categories.length === 0 ? (
            <Text className="text-sm text-textLight mb-4">
              No categories yet. Add some in Settings → Manage Categories.
            </Text>
          ) : (
            <View className="flex-row flex-wrap gap-2 mb-4">
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-full ${
                    category === cat ? 'bg-primary' : 'bg-cardBackground border border-border'
                  }`}
                >
                  <Text
                    className={category === cat ? 'text-white text-sm' : 'text-text text-sm'}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text className="text-sm font-medium text-text mb-1">Date</Text>
          <TextInput
            className="bg-cardBackground border border-border rounded-lg px-4 py-3 mb-6 text-text"
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
          />

          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className="bg-primary py-3 rounded-lg items-center"
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">Save Transaction</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
