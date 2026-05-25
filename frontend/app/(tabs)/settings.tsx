import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useExpense } from '../../context/ExpenseContext';
import { useAuth, ApiError } from '../../context/AuthContext';
import FilterModal from '../../components/FilterModal';
import { DatePeriod } from '../../types';
import { DATE_PERIOD_LABELS } from '../../constants/Tags';
import { exportTransactions } from '../../utils/exportData';
import { formatCurrency } from '../../utils/formatters';
import { getApiBaseUrl } from '../../constants/Api';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const {
    getTransactionsByPeriod,
    categories,
    addCategory,
    deleteCategory,
    isLoading,
  } = useExpense();
  const [period, setPeriod] = useState<DatePeriod>('month');
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryType, setCategoryType] = useState<'expense' | 'income'>('expense');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);

  const filtered = getTransactionsByPeriod(period);
  const income = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const filteredCategories = categories.filter((c) => c.type === categoryType);

  const handleExport = async () => {
    await exportTransactions(filtered, period);
  };

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      Alert.alert('Error', 'Enter a category name.');
      return;
    }

    setAddingCategory(true);
    try {
      await addCategory(name, categoryType);
      setNewCategoryName('');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not add category';
      Alert.alert('Error', message);
    } finally {
      setAddingCategory(false);
    }
  };

  const handleDeleteCategory = (id: number, name: string) => {
    Alert.alert('Delete Category', `Remove "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCategory(id);
          } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Could not delete category';
            Alert.alert('Error', message);
          }
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 32 }}>
      <Text className="text-2xl font-bold mx-4 mt-5 text-text">Settings</Text>
      <Text className="text-sm text-textLight mx-4 mb-2">
        Signed in as {user?.name ?? user?.email}
      </Text>
      <Text className="text-xs text-textLight mx-4 mb-6">API: {getApiBaseUrl()}</Text>

      <View className="bg-cardBackground mx-4 p-4 rounded-xl mb-4">
        <Text className="text-lg font-semibold text-text mb-1">Manage Categories</Text>
        <Text className="text-sm text-textLight mb-4">
          Add your own income and expense categories. They appear when adding transactions.
        </Text>

        <View className="flex-row mb-3 gap-2">
          {(['expense', 'income'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setCategoryType(t)}
              className={`flex-1 py-2 rounded-lg items-center ${
                categoryType === t ? 'bg-primary' : 'bg-background border border-border'
              }`}
            >
              <Text
                className={
                  categoryType === t ? 'text-white font-medium text-sm' : 'text-text text-sm'
                }
              >
                {t === 'income' ? 'Income' : 'Expense'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="flex-row gap-2 mb-4">
          <TextInput
            className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-text"
            placeholder="New category name"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
          />
          <TouchableOpacity
            onPress={handleAddCategory}
            disabled={addingCategory}
            className="bg-primary px-4 rounded-lg justify-center"
          >
            {addingCategory ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold">Add</Text>
            )}
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator className="my-2" />
        ) : filteredCategories.length === 0 ? (
          <Text className="text-sm text-textLight">No categories for this type yet.</Text>
        ) : (
          filteredCategories.map((cat) => (
            <View
              key={cat.id}
              className="flex-row justify-between items-center py-2 border-b border-border"
            >
              <Text className="text-base text-text">{cat.name}</Text>
              <TouchableOpacity onPress={() => handleDeleteCategory(cat.id, cat.name)}>
                <Text className="text-danger text-sm">Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View className="bg-cardBackground mx-4 p-4 rounded-xl mb-4">
        <Text className="text-lg font-semibold text-text mb-1">Export Transactions</Text>
        <Text className="text-sm text-textLight mb-4">
          Export transactions filtered by day, week, month, or year. Share as CSV via your
          device's share menu.
        </Text>

        <Text className="text-sm font-medium text-text mb-2">Time period</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-background border border-border rounded-lg px-4 py-3 mb-4"
        >
          <Text className="text-base text-text">{DATE_PERIOD_LABELS[period]}</Text>
        </TouchableOpacity>

        <View className="bg-background rounded-lg p-3 mb-4">
          <Text className="text-sm text-textLight">
            {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} in this period
          </Text>
          <Text className="text-sm text-text mt-1">
            Income: {formatCurrency(income)} · Expenses: {formatCurrency(expense)}
          </Text>
          <Text className="text-sm font-medium text-text mt-1">
            Net: {formatCurrency(income - expense)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleExport}
          className="bg-primary py-3 rounded-lg items-center"
        >
          <Text className="text-white font-semibold text-base">Export & Share</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-cardBackground mx-4 p-4 rounded-xl mb-4">
        <Text className="text-base font-semibold text-text mb-2">About</Text>
        <Text className="text-sm text-textLight leading-5">
          Expense Tracker helps you track income and expenses in Philippine Peso (₱), set
          savings goals, and export reports by day, week, month, or year.
        </Text>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              'Tips',
              '• Long-press a transaction in History to delete it\n• Tap a goal to add funds\n• Long-press a goal to delete it\n• Add custom categories in Settings'
            )
          }
          className="mt-3"
        >
          <Text className="text-sm text-primary">View tips</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="mx-4 py-3 rounded-lg items-center border border-danger"
      >
        <Text className="text-danger font-semibold">Sign Out</Text>
      </TouchableOpacity>

      <FilterModal
        visible={modalVisible}
        selected={period}
        onSelect={setPeriod}
        onClose={() => setModalVisible(false)}
        title="Export Period"
      />
    </ScrollView>
  );
}
