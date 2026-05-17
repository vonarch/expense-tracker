import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { useExpense } from '../../context/ExpenseContext';
import GoalCard from '../../components/GoalCard';

export default function GoalsScreen() {
  const { goals } = useExpense();

  return (
    <View className="flex-1 bg-background">
      <Text className="text-2xl font-bold m-4 text-text">My Goals</Text>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <GoalCard goal={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
