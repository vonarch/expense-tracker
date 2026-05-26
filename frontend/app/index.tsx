import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useOnboarding } from '../hooks/useOnboarding';
import { useEffect, useState } from 'react';

export default function Index() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { hasCompleted } = useOnboarding();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      hasCompleted(user.id).then((done) => {
        setNeedsOnboarding(!done);
        setOnboardingChecked(true);
      });
    } else if (!isLoading) {
      setOnboardingChecked(true);
    }
  }, [isLoading, isAuthenticated, user]);

  if (isLoading || !onboardingChecked) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) return <Redirect href="/(auth)/login" />;
  if (needsOnboarding) return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)" />;
}
