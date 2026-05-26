import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors } from '../constants/Colors';

const { width: SW } = Dimensions.get('window');

interface Props {
  visible: boolean;
  title: string;
  body: string;
  stepLabel: string;          // e.g. "1 of 4"
  anchorTop?: number;         // px from top; if undefined, centers vertically
  onNext: () => void;
  onSkip: () => void;
  nextLabel?: string;
}

export default function TourTooltip({
  visible,
  title,
  body,
  stepLabel,
  anchorTop,
  onNext,
  onSkip,
  nextLabel = 'Next',
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  const top = anchorTop !== undefined ? anchorTop : undefined;
  const justifyContent = anchorTop !== undefined ? undefined : 'center';

  return (
    <Modal transparent visible={visible} animationType="none">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.55)',
          justifyContent: justifyContent,
          paddingTop: top,
          paddingHorizontal: 24,
        }}
      >
        <Animated.View
          style={{
            opacity,
            backgroundColor: Colors.cardBackground,
            borderRadius: 16,
            padding: 20,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          {/* Arrow pointer — shown when anchored to element */}
          {anchorTop !== undefined && (
            <View
              style={{
                position: 'absolute',
                top: -10,
                left: SW / 2 - 34,
                width: 0,
                height: 0,
                borderLeftWidth: 10,
                borderRightWidth: 10,
                borderBottomWidth: 10,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: Colors.cardBackground,
              }}
            />
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ fontSize: 11, color: Colors.textLight }}>{stepLabel}</Text>
            <TouchableOpacity onPress={onSkip} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={{ fontSize: 11, color: Colors.textLight }}>Skip tour</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 6 }}>
            {title}
          </Text>
          <Text style={{ fontSize: 14, color: Colors.textLight, lineHeight: 20, marginBottom: 16 }}>
            {body}
          </Text>

          <TouchableOpacity
            onPress={onNext}
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 10,
              paddingVertical: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>{nextLabel}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}