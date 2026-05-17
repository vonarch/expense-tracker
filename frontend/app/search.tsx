import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text } from 'react-native';
import { useExpense } from '../context/ExpenseContext';
import TransactionCard from '../components/TransactionCard';
import { Colors } from '../constants/Colors';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { searchTransactions } = useExpense();
  
  const results = searchTransactions(query);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by description or category..."
        value={query}
        onChangeText={setQuery}
      />
      
      {query.trim() !== '' && results.length === 0 ? (
        <Text style={styles.emptyText}>No transactions found for "{query}"</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard transaction={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchInput: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.textLight,
    fontSize: 16,
  },
  list: {
    paddingBottom: 20,
  }
});
