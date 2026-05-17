import React from 'react';
import { View, Text } from 'react-native';
import { Goal } from '../types';

interface Props {
  goal: Goal;
}

export default function GoalCard({ goal }: Props) {
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

  return (
    <View className="bg-cardBackground p-4 my-2 mx-4 rounded-xl shadow-sm elevation-sm">
      <View className="flex-row justify-between mb-3">
        <Text className="text-base font-semibold text-text">{goal.title}</Text>
        <Text className="text-sm font-medium text-textLight">${goal.currentAmount} / ${goal.targetAmount}</Text>
      </View>
      <View className="h-2 bg-border rounded-full overflow-hidden">
        <View className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
      </View>
      {goal.deadline && (
        <Text className="text-xs text-textLight mt-3 text-right">Target Date: {goal.deadline}</Text>
      )}
    </View>
  );
}
