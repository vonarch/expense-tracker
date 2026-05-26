import React, { useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useExpense } from '../../context/ExpenseContext';
import { useAuth } from '../../context/AuthContext';
import { useTour } from '../../context/TourContext';
import TourTooltip from '../../components/TourTooltip';
import TransactionCard from '../../components/TransactionCard';

export default function HistoryScreen() {
  const { transactions } = useExpense();
  const router = useRouter();
  const { tour } = useLocalSearchParams<{ tour?: string }>();
  const { user } = useAuth();
  const { step, next, complete } = useTour();

  useEffect(() => {
    // step is already 'history' set by dashboard's next(); nothing to start here
  }, [tour]);
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

      <TourTooltip
        visible={step === 'history'}
        title="Manage Transactions"
        body="All your transactions are listed here, newest first. Long-press any entry to delete it. Use Search to filter by keyword or date."
        stepLabel="2 of 4"
        anchorTop={210}
        onNext={() => {
          next('history');
          router.push({ pathname: '/(tabs)/goals', params: { tour: '1' } });
        }}
        onSkip={complete}
      />

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionCard transaction={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
