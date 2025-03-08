import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function WorkoutPlanner() {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday'); // Default to Monday
  const [workoutList, setWorkoutList] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  const addWorkout = () => {
    if (exercise.trim() && sets.trim() && reps.trim()) {
      setWorkoutList({
        ...workoutList,
        [selectedDay]: [
          ...workoutList[selectedDay],
          { id: Date.now().toString(), exercise, sets, reps },
        ],
      });
      setExercise('');
      setSets('');
      setReps('');
    } else {
      Alert.alert('Oops!', 'Please fill all fields.');
    }
  };

  const removeWorkout = (id) => {
    setWorkoutList({
      ...workoutList,
      [selectedDay]: workoutList[selectedDay].filter((item) => item.id !== id),
    });
  };

  return (
    <>
      {/* ✅ Set Custom Header Title */}
      <Stack.Screen options={{ title: '📋 Workout Planner' }} />

      <View style={styles.container}>
        <Text style={styles.title}>🌸 Weekly Workout Planner 🏋️‍♀️</Text>

        {/* Day Selector */}
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

        {/* Input Fields */}
        <TextInput placeholder="Exercise Name" value={exercise} onChangeText={setExercise} style={styles.input} />
        <TextInput placeholder="Sets" value={sets} onChangeText={setSets} keyboardType="numeric" style={styles.input} />
        <TextInput placeholder="Reps" value={reps} onChangeText={setReps} keyboardType="numeric" style={styles.input} />

        {/* Add Button */}
        <TouchableOpacity style={styles.addButton} onPress={addWorkout}>
          <Text style={styles.addButtonText}>+ Add Exercise</Text>
        </TouchableOpacity>

        {/* Workout List for Selected Day */}
        <Text style={styles.subTitle}>{selectedDay} Workouts</Text>
        <FlatList
          data={workoutList[selectedDay]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.workoutItem}>
              <Text style={styles.workoutText}>
                {item.exercise} - {item.sets} sets x {item.reps} reps
              </Text>
              <TouchableOpacity onPress={() => removeWorkout(item.id)}>
                <Text style={styles.deleteButton}>❌</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffe6f2' }, // Soft pink background
  title: { fontSize: 28, fontWeight: 'bold', color: '#ff4d94', textAlign: 'center', marginBottom: 15 },
  subTitle: { fontSize: 22, fontWeight: 'bold', color: '#d6336c', textAlign: 'center', marginVertical: 10 },

  // Day Selector
  daySelector: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
  dayButton: { backgroundColor: '#ffcce6', padding: 10, borderRadius: 20, marginHorizontal: 5 },
  selectedDay: { backgroundColor: '#ff4d94' },
  dayText: { fontSize: 16, fontWeight: 'bold', color: 'white' },

  // Input Fields
  input: { borderWidth: 1, borderColor: '#ff4d94', padding: 12, marginVertical: 5, backgroundColor: 'white', borderRadius: 10, textAlign: 'center' },

  // Add Button
  addButton: { backgroundColor: '#ff4d94', padding: 15, borderRadius: 30, marginVertical: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 2, height: 3 }, shadowOpacity: 0.3, shadowRadius: 5 },
  addButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  // Workout List
  workoutItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, marginTop: 8, backgroundColor: '#ffcce6', borderRadius: 10 },
  workoutText: { fontSize: 16, fontWeight: 'bold', color: '#d6336c' },
  deleteButton: { fontSize: 20, color: 'red' },
});
