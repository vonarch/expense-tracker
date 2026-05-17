import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const { login, signup } = useAuth();
  const router = useRouter();

  const handleSubmit = () => {
    if (isLogin) {
      login(email, password);
    } else {
      signup(email, password, name);
    }
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 justify-center bg-background px-6"
    >
      <View className="items-center mb-10">
        <Text className="text-4xl font-bold text-primary mb-2">ExpenseTracker</Text>
        <Text className="text-base text-textLight">
          {isLogin ? 'Sign in to manage your finances' : 'Create an account to get started'}
        </Text>
      </View>

      <View className="bg-cardBackground p-6 rounded-2xl shadow-sm elevation-md">
        {!isLogin && (
          <TextInput
            className="bg-background px-4 py-3 rounded-lg mb-4 text-text border border-border"
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          className="bg-background px-4 py-3 rounded-lg mb-4 text-text border border-border"
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          className="bg-background px-4 py-3 rounded-lg mb-6 text-text border border-border"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          className="bg-primary py-4 rounded-xl items-center mb-4"
          onPress={handleSubmit}
        >
          <Text className="text-white text-base font-bold">{isLogin ? 'Sign In' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <Text className="text-primary text-center font-medium">
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
