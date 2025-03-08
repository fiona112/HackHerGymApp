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
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [searchQuery, setSearchQuery] = useState('');
  const [workoutName, setWorkoutName] = useState('');
  const [savedWorkouts, setSavedWorkouts] = useState([]);
  const [workoutList, setWorkoutList] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  const addExercise = (exercise) => {
    if (!workoutList[selectedDay].find((item) => item.exercise === exercise)) {
      setWorkoutList({
        ...workoutList,
        [selectedDay]: [
          ...workoutList[selectedDay],
          { id: Date.now().toString(), exercise },
        ],
      });
    } else {
      Alert.alert('Already Added', 'This exercise is already in your plan.');
    }
  };

  const removeExercise = (id) => {
    setWorkoutList({
      ...workoutList,
      [selectedDay]: workoutList[selectedDay].filter((item) => item.id !== id),
    });
  };

  const saveWorkoutPlan = () => {
    if (workoutName.trim() === '') {
      Alert.alert('Oops!', 'Give your workout a name.');
      return;
    }
    if (workoutList[selectedDay].length === 0) {
      Alert.alert('Oops!', 'Add some exercises to save your plan.');
      return;
    }
    setSavedWorkouts([...savedWorkouts, { id: Date.now().toString(), name: workoutName, exercises: workoutList[selectedDay] }]);
    setWorkoutName('');
  };

  return (
    <>
      {/* ✅ Set Custom Header Title */}
      <Stack.Screen options={{ title: '📋 Workout Planner' }} />

      <View style={styles.container}>
        <Text style={styles.title}>🌸 Plan Your Weekly Workout 🏋️‍♀️</Text>

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

        {/* Weekly Planner (Days) */}
        <View style={styles.daySelector}>
          {Object.keys(workoutList).map((day) => (
            <TouchableOpacity
              key={day}
              style={[styles.dayButton, selectedDay === day && styles.selectedDay]}
              onPress={() => setSelectedDay(day)}
            >
              <Text style={styles.dayText}>{day.substring(0, 3)}</Text>
            </TouchableOpacity>
          ))}
        </View>

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

        {/* Selected Exercises for the Day */}
        <Text style={styles.subTitle}>{selectedDay} Workouts</Text>
        <FlatList
          data={workoutList[selectedDay]}
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
      </View>
    </>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffe6f2' },
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

  // Weekly Planner
  daySelector: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
  dayButton: { backgroundColor: '#ffcce6', padding: 10, borderRadius: 20, marginHorizontal: 5 },
  selectedDay: { backgroundColor: '#ff4d94' },
  dayText: { fontSize: 16, fontWeight: 'bold', color: 'white' },

  // Exercises List
  exerciseItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#ffcce6', borderRadius: 10, marginVertical: 5 },
  exerciseText: { color: '#d6336c', fontSize: 16 },

  selectedItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#ffb3d9', borderRadius: 10, marginVertical: 5 },
  selectedText: { color: '#d6336c', fontSize: 16 },
});
