import '../global.css';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { ExpenseProvider } from '../context/ExpenseContext';
import { TourProvider } from '../context/TourContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <TourProvider>
        <Stack screenOptions={{ headerStyle: { backgroundColor: '#f8f9fa' } }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="search" options={{ title: 'Search' }} />
          <Stack.Screen name="transaction/add" options={{ title: 'Add Transaction' }} />
        </Stack>
        </TourProvider>
      </ExpenseProvider>
    </AuthProvider>
  );
}
