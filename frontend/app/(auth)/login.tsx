import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, ApiError } from '../../context/AuthContext';
import { getApiBaseUrl } from '../../constants/Api';
import { useOnboarding } from '../../hooks/useOnboarding';
import { apiFetch } from '../../services/api';

export default function LoginScreen() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      await apiFetch<{ status: string }>('/health');
      Alert.alert('Success', 'Connected to the backend.');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Could not connect. Run backend\\scripts\\open-firewall.bat as Administrator.';
      Alert.alert('Connection failed', message);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }
    if (isRegister && !name.trim()) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(name.trim(), email.trim(), password);
        router.replace('/onboarding');
      } else {
        await login(email.trim(), password);
        router.replace('/');
        // router.replace('/(tabs)');
      }
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold text-text mb-1">Expense Tracker</Text>
        <Text className="text-textLight mb-8">
          {isRegister ? 'Create your account' : 'Sign in to continue'}
        </Text>

        {isRegister && (
          <>
            <Text className="text-sm font-medium text-text mb-1">Name</Text>
            <TextInput
              className="bg-cardBackground border border-border rounded-lg px-4 py-3 mb-4 text-text"
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </>
        )}

        <Text className="text-sm font-medium text-text mb-1">Email</Text>
        <TextInput
          className="bg-cardBackground border border-border rounded-lg px-4 py-3 mb-4 text-text"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text className="text-sm font-medium text-text mb-1">Password</Text>
        <TextInput
          className="bg-cardBackground border border-border rounded-lg px-4 py-3 mb-6 text-text"
          placeholder="At least 6 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          onPress={handleTestConnection}
          disabled={testingConnection}
          className="bg-cardBackground border border-border py-3 rounded-lg items-center mb-3"
        >
          {testingConnection ? (
            <ActivityIndicator />
          ) : (
            <Text className="text-primary font-semibold">Test connection</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          className="bg-primary py-3 rounded-lg items-center mb-4"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">
              {isRegister ? 'Create Account' : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
          <Text className="text-center text-primary">
            {isRegister
              ? 'Already have an account? Sign in'
              : "Don't have an account? Register"}
          </Text>
        </TouchableOpacity>

        <Text className="text-xs text-textLight text-center mt-6 px-2" selectable>
          API: {getApiBaseUrl()}
        </Text>
        <Text className="text-xs text-textLight text-center mt-2 px-2">
          If you see 10.0.2.2, that is wrong (emulator only). It should be 192.168.2.116.
          Restart Expo: npx expo start -c
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
