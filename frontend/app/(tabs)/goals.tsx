import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useExpense } from '../../context/ExpenseContext';
import GoalCard from '../../components/GoalCard';
export default function GoalsScreen() {
  const { goals, addGoal, updateGoalProgress, deleteGoal } = useExpense();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [contributeModalVisible, setContributeModalVisible] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [contributeAmount, setContributeAmount] = useState('');

  const resetAddForm = () => {
    setTitle('');
    setTargetAmount('');
    setDeadline('');
  };

  const handleAddGoal = () => {
    const target = parseFloat(targetAmount);
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a goal title.');
      return;
    }
    if (isNaN(target) || target <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount.');
      return;
    }
    addGoal({
      title: title.trim(),
      targetAmount: target,
      deadline: deadline.trim() || undefined,
    });
    resetAddForm();
    setAddModalVisible(false);
  };

  const handleContribute = () => {
    const amount = parseFloat(contributeAmount);
    if (!selectedGoalId || isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }
    updateGoalProgress(selectedGoalId, amount);
    setContributeAmount('');
    setContributeModalVisible(false);
    setSelectedGoalId(null);
  };

  const openContribute = (id: string) => {
    setSelectedGoalId(id);
    setContributeAmount('');
    setContributeModalVisible(true);
  };

  const selectedGoal = goals.find((g) => g.id === selectedGoalId);

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row justify-between items-center mx-4 mt-5 mb-2">
        <Text className="text-2xl font-bold text-text">My Goals</Text>
        <TouchableOpacity
          onPress={() => setAddModalVisible(true)}
          className="bg-primary px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">+ Add</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-sm text-textLight mx-4 mb-3">
        Tap to add funds · Long press to delete
      </Text>

      {goals.length === 0 ? (
        <Text className="text-center text-textLight mt-10 mx-4">
          No goals yet. Tap "+ Add" to create your first savings goal.
        </Text>
      ) : (
        <FlatList
          data={goals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <GoalCard
              goal={item}
              onContribute={openContribute}
              onDelete={deleteGoal}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <Modal visible={addModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 justify-end bg-black/40"
        >
          <View className="bg-cardBackground rounded-t-2xl p-5">
            <Text className="text-lg font-bold text-text mb-4">New Goal</Text>
            <TextInput
              className="bg-background border border-border rounded-lg px-4 py-3 mb-3 text-text"
              placeholder="Goal title (e.g. Vacation Fund)"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              className="bg-background border border-border rounded-lg px-4 py-3 mb-3 text-text"
              placeholder="Target amount"
              value={targetAmount}
              onChangeText={setTargetAmount}
              keyboardType="decimal-pad"
            />
            <TextInput
              className="bg-background border border-border rounded-lg px-4 py-3 mb-4 text-text"
              placeholder="Deadline (YYYY-MM-DD, optional)"
              value={deadline}
              onChangeText={setDeadline}
            />
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  resetAddForm();
                  setAddModalVisible(false);
                }}
                className="flex-1 py-3 rounded-lg bg-background border border-border items-center"
              >
                <Text className="text-textLight">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddGoal}
                className="flex-1 py-3 rounded-lg bg-primary items-center"
              >
                <Text className="text-white font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={contributeModalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1 justify-end bg-black/40"
        >
          <View className="bg-cardBackground rounded-t-2xl p-5">
            <Text className="text-lg font-bold text-text mb-1">Add Funds</Text>
            {selectedGoal && (
              <Text className="text-sm text-textLight mb-4">{selectedGoal.title}</Text>
            )}
            <TextInput
              className="bg-background border border-border rounded-lg px-4 py-3 mb-4 text-text"
              placeholder="Amount to add"
              value={contributeAmount}
              onChangeText={setContributeAmount}
              keyboardType="decimal-pad"
              autoFocus
            />
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setContributeModalVisible(false)}
                className="flex-1 py-3 rounded-lg bg-background border border-border items-center"
              >
                <Text className="text-textLight">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleContribute}
                className="flex-1 py-3 rounded-lg bg-primary items-center"
              >
                <Text className="text-white font-semibold">Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
