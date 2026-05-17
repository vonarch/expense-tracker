import React, { useState } from 'react';
import { View, TextInput, FlatList, Text } from 'react-native';
import { useExpense } from '../context/ExpenseContext';
import TransactionCard from '../components/TransactionCard';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { searchTransactions } = useExpense();
  
  const results = searchTransactions(query);

  return (
    <View className="flex-1 bg-background">
      <TextInput
        className="bg-white px-4 py-3 m-4 rounded-lg text-base border border-border"
        placeholder="Search by description or category..."
        value={query}
        onChangeText={setQuery}
      />
      
      {query.trim() !== '' && results.length === 0 ? (
        <Text className="text-center mt-5 text-textLight text-base">No transactions found for "{query}"</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard transaction={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
