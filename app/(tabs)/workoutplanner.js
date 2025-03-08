import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const muscleGroups = [
  { name: 'Chest', emoji: '💖' },
  { name: 'Back', emoji: '🏋️‍♀️' },
  { name: 'Legs', emoji: '🦵' },
  { name: 'Shoulders', emoji: '💜' },
  { name: 'Arms', emoji: '💪' },
  { name: 'Core', emoji: '🔥' },
];

const exercises = {
  Chest: ['Bench Press', 'Incline Dumbbell Press', 'Chest Flys', 'Push-ups'],
  Back: ['Deadlifts', 'Pull-ups', 'Bent-over Rows', 'Lat Pulldown'],
  Legs: ['Squats', 'Leg Press', 'Lunges', 'Calf Raises'],
  Shoulders: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Face Pulls'],
  Arms: ['Bicep Curls', 'Triceps Dips', 'Hammer Curls', 'Skull Crushers'],
  Core: ['Planks', 'Russian Twists', 'Leg Raises', 'Hanging Knee Raises'],
};

export default function WorkoutPlanner() {
  const [selectedGroup, setSelectedGroup] = useState('Chest');
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [workoutName, setWorkoutName] = useState('');
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addExercise = (exercise) => {
    if (!selectedExercises.find((item) => item.exercise === exercise)) {
      setSelectedExercises([...selectedExercises, { id: Date.now().toString(), exercise }]);
    } else {
      Alert.alert('Already Added', 'This exercise is already in your plan.');
    }
  };

  const removeExercise = (id) => {
    setSelectedExercises(selectedExercises.filter((item) => item.id !== id));
  };

  const saveWorkoutPlan = () => {
    if (workoutName.trim() === '') {
      Alert.alert('Oops!', 'Give your workout a name.');
      return;
    }
    if (selectedExercises.length === 0) {
      Alert.alert('Oops!', 'Add some exercises to save your plan.');
      return;
    }
    setSavedWorkouts([...savedWorkouts, { id: Date.now().toString(), name: workoutName, exercises: selectedExercises }]);
    setWorkoutName('');
    setSelectedExercises([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌸 Plan Your Workout</Text>

      {/* Search Bar */}
      <TextInput
        placeholder="Search for an exercise..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
        placeholderTextColor="#d6336c"
      />

      {/* Muscle Group Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.groupSelector}>
        {muscleGroups.map((group) => (
          <TouchableOpacity
            key={group.name}
            style={[styles.groupButton, selectedGroup === group.name && styles.selectedGroup]}
            onPress={() => setSelectedGroup(group.name)}
          >
            <Text style={[styles.groupText, selectedGroup === group.name && styles.selectedGroupText]}>
              {group.emoji} {group.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Available Exercises for Selected Muscle Group */}
      <Text style={styles.subTitle}>Available Exercises</Text>
      <FlatList
        data={exercises[selectedGroup].filter((ex) => ex.toLowerCase().includes(searchQuery.toLowerCase()))}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.exerciseItem} onPress={() => addExercise(item)}>
            <Text style={styles.exerciseText}>{item}</Text>
            <Ionicons name="add-circle-outline" size={24} color="#ff4d94" />
          </TouchableOpacity>
        )}
      />

      {/* Selected Exercises */}
      <Text style={styles.subTitle}>Your Workout Plan</Text>
      <FlatList
        data={selectedExercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.selectedItem}>
            <Text style={styles.selectedText}>{item.exercise}</Text>
            <TouchableOpacity onPress={() => removeExercise(item.id)}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Save Workout Plan */}
      <TextInput
        placeholder="Name your workout..."
        value={workoutName}
        onChangeText={setWorkoutName}
        style={styles.input}
        placeholderTextColor="#d6336c"
      />
      <TouchableOpacity style={styles.addButton} onPress={saveWorkoutPlan}>
        <Text style={styles.addButtonText}>💾 Save Workout Plan</Text>
      </TouchableOpacity>

      {/* Saved Workouts */}
      <Text style={styles.subTitle}>Saved Workouts</Text>
      <FlatList
        data={savedWorkouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.savedWorkout}>
            <Text style={styles.savedText}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffe6f2' }, // Soft pink theme
  title: { fontSize: 28, fontWeight: 'bold', color: '#ff4d94', textAlign: 'center', marginBottom: 15 },
  subTitle: { fontSize: 22, fontWeight: 'bold', color: '#d6336c', textAlign: 'center', marginVertical: 10 },

  // Search Bar
  searchInput: { borderWidth: 1, borderColor: '#ff4d94', padding: 10, marginBottom: 10, backgroundColor: 'white', borderRadius: 10, textAlign: 'center' },

  // Muscle Group Selector
  groupSelector: { flexDirection: 'row', marginBottom: 15 },
  groupButton: { padding: 12, borderRadius: 15, marginRight: 10, backgroundColor: '#ffcce6' },
  selectedGroup: { backgroundColor: '#ff4d94' },
  groupText: { fontSize: 16, fontWeight: 'bold', color: '#d6336c' },
  selectedGroupText: { color: 'white' },

  // Exercises List
  exerciseItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#ffcce6', borderRadius: 10, marginVertical: 5 },
  exerciseText: { color: '#d6336c', fontSize: 16 },

  // Selected Exercises List
  selectedItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#ffb3d9', borderRadius: 10, marginVertical: 5 },
  selectedText: { color: '#d6336c', fontSize: 16 },

  // Save Workout Button
  addButton: { backgroundColor: '#ff4d94', padding: 15, borderRadius: 30, alignItems: 'center', marginVertical: 10 },
  addButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  // Saved Workouts
  savedWorkout: { padding: 15, backgroundColor: '#ffcce6', borderRadius: 10, marginVertical: 5 },
  savedText: { color: '#d6336c', fontSize: 18, fontWeight: 'bold' },
});
