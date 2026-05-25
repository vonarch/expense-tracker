import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';

type IoniconName = keyof typeof Ionicons.glyphMap;

function tabIcon(
  outline: IoniconName,
  filled: IoniconName
): (props: { color: string; size: number; focused: boolean }) => React.ReactNode {
  return ({ color, size, focused }) => (
    <Ionicons name={focused ? filled : outline} size={size} color={color} />
  );
}

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (!isLoading && !isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.tabIconDefault,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: tabIcon('home-outline', 'home'),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: tabIcon('time-outline', 'time'),
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            title: 'Goals',
            tabBarIcon: tabIcon('flag-outline', 'flag'),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: tabIcon('settings-outline', 'settings'),
          }}
        />
      </Tabs>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});
