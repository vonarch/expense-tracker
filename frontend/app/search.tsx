import React, { useState } from 'react';
import { View, TextInput, FlatList, Text } from 'react-native';
import { useExpense } from '../context/ExpenseContext';
import TransactionCard from '../components/TransactionCard';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { searchTransactions } = useExpense();

  const results = searchTransactions(query);
  const isFiltering = query.trim() !== '';

  return (
      <View className="flex-1 bg-background">
        <TextInput
          className="bg-white px-4 py-3 m-4 rounded-lg text-base border border-border text-text"
          placeholder="Search description, category, amount, date..."
          value={query}
          onChangeText={setQuery}
          autoFocus
          clearButtonMode="while-editing"
        />

        {!isFiltering && (
          <Text className="text-sm text-textLight mx-4 mb-2">
            Showing all transactions. Type to filter.
          </Text>
        )}

        {isFiltering && results.length === 0 ? (
          <Text className="text-center mt-5 text-textLight text-base px-4">
            No transactions found for "{query}"
          </Text>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TransactionCard transaction={item} />}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text className="text-center mt-10 text-textLight">No transactions yet.</Text>
            }
          />
        )}
      </View>
  );
}
