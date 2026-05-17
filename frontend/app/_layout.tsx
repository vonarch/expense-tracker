import { Slot } from 'expo-router';
import { ExpenseProvider } from '../context/ExpenseContext';

export default function RootLayout() {
  return (
    <ExpenseProvider>
      <Slot />
    </ExpenseProvider>
  );
}
