import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CategoryBreakdown } from '../types';
import { formatCurrency } from '../utils/formatters';
import { Colors } from '../constants/Colors';

interface Props {
  data: CategoryBreakdown[];
  title?: string;
}

export default function SummaryChart({ data, title = 'Spending by Category' }: Props) {
  if (data.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.emptyText}>No expense data for this period.</Text>
      </View>
    );
  }

  const maxTotal = Math.max(...data.map((d) => d.total));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {data.map((item) => {
        const widthPercent = maxTotal > 0 ? (item.total / maxTotal) * 100 : 0;
        return (
          <View key={item.category} style={styles.row}>
            <View style={styles.labelRow}>
              <Text style={styles.categoryLabel}>{item.category}</Text>
              <Text style={styles.amountLabel}>{formatCurrency(item.total)}</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${widthPercent}%` }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  row: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 14,
    color: Colors.text,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textLight,
  },
  track: {
    height: 10,
    backgroundColor: Colors.border,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 999,
  },
});
