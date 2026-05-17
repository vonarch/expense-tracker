import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Goal } from '../types';
import { Colors } from '../constants/Colors';

interface Props {
  goal: Goal;
}

export default function GoalCard({ goal }: Props) {
  const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{goal.title}</Text>
        <Text style={styles.amounts}>${goal.currentAmount} / ${goal.targetAmount}</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
      {goal.deadline && (
        <Text style={styles.deadline}>Target Date: {goal.deadline}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  amounts: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textLight,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  deadline: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 12,
    textAlign: 'right',
  },
});
