import '../global.css';
import { Stack } from 'expo-router';
import { ExpenseProvider } from '../context/ExpenseContext';

export default function RootLayout() {
  return (
    <ExpenseProvider>
      <Stack screenOptions={{ headerStyle: { backgroundColor: '#f8f9fa' } }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ title: 'Search' }} />
        <Stack.Screen name="transaction/add" options={{ title: 'Add Transaction' }} />
      </Stack>
    </ExpenseProvider>
  );
}
