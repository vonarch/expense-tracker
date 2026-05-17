import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useExpense } from '../../context/ExpenseContext';
import GoalCard from '../../components/GoalCard';
import { Colors } from '../../constants/Colors';

export default function GoalsScreen() {
  const { goals } = useExpense();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Goals</Text>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GoalCard goal={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    color: Colors.text,
  },
  list: {
    paddingBottom: 20,
  }
});
