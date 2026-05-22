import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { DatePeriod } from '../types';
import { DATE_PERIOD_LABELS } from '../constants/Tags';

interface Props {
  visible: boolean;
  selected: DatePeriod;
  onSelect: (period: DatePeriod) => void;
  onClose: () => void;
  title?: string;
}

const PERIODS: DatePeriod[] = ['day', 'week', 'month', 'year'];

export default function FilterModal({
  visible,
  selected,
  onSelect,
  onClose,
  title = 'Select Period',
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/40 justify-end"
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <View className="bg-cardBackground rounded-t-2xl px-4 pt-4 pb-8">
            <Text className="text-lg font-bold text-text mb-4">{title}</Text>
            {PERIODS.map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => {
                  onSelect(period);
                  onClose();
                }}
                className={`py-3 px-4 rounded-lg mb-2 ${
                  selected === period ? 'bg-primary/15' : 'bg-background'
                }`}
              >
                <Text
                  className={`text-base ${
                    selected === period ? 'text-primary font-semibold' : 'text-text'
                  }`}
                >
                  {DATE_PERIOD_LABELS[period]}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={onClose} className="mt-2 py-3 items-center">
              <Text className="text-base text-textLight">Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
