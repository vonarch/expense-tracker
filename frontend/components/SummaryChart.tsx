import React from 'react';
import { View, Text } from 'react-native';
import { CategoryBreakdown } from '../types';
import { formatCurrency } from '../utils/formatters';

interface Props {
  data: CategoryBreakdown[];
  title?: string;
}

export default function SummaryChart({ data, title = 'Spending by Category' }: Props) {
  if (data.length === 0) {
    return (
      <View className="bg-cardBackground mx-4 p-4 rounded-xl">
        <Text className="text-base font-semibold text-text mb-2">{title}</Text>
        <Text className="text-sm text-textLight">No expense data for this period.</Text>
      </View>
    );
  }

  const maxTotal = Math.max(...data.map((d) => d.total));

  return (
    <View className="bg-cardBackground mx-4 p-4 rounded-xl shadow-sm">
      <Text className="text-base font-semibold text-text mb-4">{title}</Text>
      {data.map((item) => {
        const widthPercent = maxTotal > 0 ? (item.total / maxTotal) * 100 : 0;
        return (
          <View key={item.category} className="mb-3">
            <View className="flex-row justify-between mb-1">
              <Text className="text-sm text-text">{item.category}</Text>
              <Text className="text-sm font-medium text-textLight">
                {formatCurrency(item.total)}
              </Text>
            </View>
            <View className="h-2.5 bg-border rounded-full overflow-hidden">
              <View
                className="h-full bg-primary rounded-full"
                style={{ width: `${widthPercent}%` }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
