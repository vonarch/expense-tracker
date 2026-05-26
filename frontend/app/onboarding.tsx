import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ListRenderItemInfo,
  ViewToken,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useOnboarding } from '../hooks/useOnboarding';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  bg: string;
  title: string;
  subtitle: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: 'wallet-outline',
    iconColor: Colors.primary,
    bg: '#EBF5FB',
    title: 'Track Every Peso',
    subtitle:
      'Log income and expenses in seconds. \nStay on top of where your money goes, effortlessly.',
  },
  {
    id: '2',
    icon: 'pie-chart-outline',
    iconColor: Colors.success,
    bg: '#EAFAF1',
    title: 'See the Big Picture',
    subtitle:
      'Visual breakdowns by category reveal spending patterns so you can make smarter decisions.',
  },
  {
    id: '3',
    icon: 'create-outline',
    iconColor: '#f59e0b',
    bg: '#FFFBEB',
    title: 'Full Control',
    subtitle:
      'Add, edit, or delete any transaction at any time. \nYour data, fully under your control.',
  },
  {
    id: '4',
    icon: 'checkmark-circle-outline',
    iconColor: Colors.primary,
    bg: '#EBF5FB',
    title: "You're All Set",
    subtitle:
      'Your account is ready! \nStart by adding your first transaction.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { markCompleted } = useOnboarding();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const finish = async () => {
    if (user) await markCompleted(user.id);
    router.replace({ pathname: '/(tabs)', params: { tour: '1' } });
  };

  const next = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      finish();
    }
  };

  const skip = async () => {
    if (user) await markCompleted(user.id);
    router.replace('/(tabs)');
    // skip = no tour
  };

  const renderSlide = ({ item }: ListRenderItemInfo<Slide>) => (
    <View
      style={{ width }}
      className="flex-1 items-center justify-center px-8"
    >
      <View
        style={{ backgroundColor: item.bg }}
        className="w-32 h-32 rounded-full items-center justify-center mb-8"
      >
        <Ionicons name={item.icon} size={60} color={item.iconColor} />
      </View>
      <Text className="text-2xl font-bold text-text text-center mb-3">
        {item.title}
      </Text>
      <Text className="text-base text-textLight text-center leading-6">
        {item.subtitle}
      </Text>
    </View>
  );

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />

      {/* Skip */}
      {!isLast && (
        <TouchableOpacity
          onPress={skip}
          className="absolute top-12 right-6 z-10 py-2 px-3"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-textLight text-sm font-medium">Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        className="flex-1"
      />

      {/* Dots */}
      <View className="flex-row justify-center mb-8 gap-2">
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={{
              width: i === activeIndex ? 24 : 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: i === activeIndex ? Colors.primary : Colors.border,
            }}
          />
        ))}
      </View>

      {/* CTA */}
      <View className="px-6 pb-10">
        <TouchableOpacity
          onPress={next}
          className="bg-primary py-4 rounded-2xl items-center"
          activeOpacity={0.85}
        >
          <Text className="text-white font-semibold text-base">
            {isLast ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
