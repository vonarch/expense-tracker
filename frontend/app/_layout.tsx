import { Slot } from 'expo-router';
import { ExpenseProvider } from '../context/ExpenseContext';
import { AuthProvider } from '../context/AuthContext';
import './global.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <Slot />
      </ExpenseProvider>
    </AuthProvider>
  );
}
