import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Goal } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ApiError } from '../context/AuthContext';

interface Props {
  goal: Goal;
  onContribute?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function GoalCard({ goal, onContribute, onDelete }: Props) {
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isComplete = goal.currentAmount >= goal.targetAmount;

  const handleLongPress = () => {
    if (!onDelete) return;
    Alert.alert('Delete Goal', `Remove "${goal.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await onDelete(goal.id);
          } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Could not delete goal';
            Alert.alert('Error', message);
          }
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      activeOpacity={onContribute ? 0.7 : 1}
      onPress={() => onContribute?.(goal.id)}
      className="bg-cardBackground p-4 my-2 mx-4 rounded-xl shadow-sm"
    >
      <View className="flex-row justify-between mb-3">
        <Text className="text-base font-semibold text-text flex-1 mr-2">{goal.title}</Text>
        <Text className="text-sm font-medium text-textLight">
          {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
        </Text>
      </View>
      <View className="h-2.5 bg-border rounded-full overflow-hidden">
        <View
          className={`h-full rounded-full ${isComplete ? 'bg-success' : 'bg-primary'}`}
          style={{ width: `${progress}%` }}
        />
      </View>
      <View className="flex-row justify-between mt-3">
        <Text className="text-xs text-textLight">{progress.toFixed(0)}% complete</Text>
        {goal.deadline && (
          <Text className="text-xs text-textLight">Target: {formatDate(goal.deadline)}</Text>
        )}
      </View>
      {onContribute && !isComplete && (
        <Text className="text-xs text-primary mt-2 text-center">Tap to add funds</Text>
      )}
      {isComplete && (
        <Text className="text-xs text-success mt-2 text-center font-medium">Goal reached!</Text>
      )}
    </TouchableOpacity>
  );
}
