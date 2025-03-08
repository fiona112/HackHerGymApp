import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';

const muscleGroups = {
  "Chest": ["Bench Press", "Push-ups", "Chest Fly"],
  "Back": ["Pull-ups", "Deadlifts", "Bent-over Rows"],
  "Legs": ["Squats", "Lunges", "Leg Press"],
  "Arms": ["Bicep Curls", "Triceps Dips", "Hammer Curls"],
  "Shoulders": ["Shoulder Press", "Lateral Raises", "Arnold Press"],
};

const savedWorkouts = [
  { id: '1', name: 'Full Body Routine', exercises: ["Squats", "Push-ups", "Pull-ups"] },
  { id: '2', name: 'Upper Body Routine', exercises: ["Bench Press", "Shoulder Press"] },
];

export default function WorkoutTracker() {
  const [selectedDate, setSelectedDate] = useState('');
  const [trackedWorkouts, setTrackedWorkouts] = useState({});
  const [expandedMuscleGroups, setExpandedMuscleGroups] = useState({});
  const [expandedSavedWorkouts, setExpandedSavedWorkouts] = useState({});
  const [currentExercise, setCurrentExercise] = useState(null);
  const [sets, setSets] = useState([]);
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const toggleMuscleGroup = (group) => {
    setExpandedMuscleGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const toggleSavedWorkout = (workoutId) => {
    setExpandedSavedWorkouts((prev) => ({ ...prev, [workoutId]: !prev[workoutId] }));
  };

  const startWorkout = (exercise) => {
    setCurrentExercise(exercise);
    setReps('');
    setWeight('');
  };

  const logSet = () => {
    if (reps.trim() === '') {
      Alert.alert("Enter reps", "Please enter the number of reps before adding a set.");
      return;
    }
    setSets([...sets, { exercise: currentExercise, reps, weight }]);
    setReps('');
    setWeight('');
  };

  const endWorkoutAndSave = () => {
    if (!selectedDate) {
      Alert.alert("Select a Date", "Please choose a date before saving your workout.");
      return;
    }
    if (sets.length === 0) {
      Alert.alert("No Workout Logged", "Log at least one set before saving.");
      return;
    }

    const workoutSummary = sets.reduce((acc, { exercise, reps, weight }) => {
      acc[exercise] = acc[exercise] || [];
      acc[exercise].push({ reps, weight });
      return acc;
    }, {});

    setTrackedWorkouts({
      ...trackedWorkouts,
      [selectedDate]: [...(trackedWorkouts[selectedDate] || []), workoutSummary],
    });

    setSets([]);
    setCurrentExercise(null);
    Alert.alert("Workout Saved!", `Your workout for ${selectedDate} has been recorded.`);
  };

  return (
    <>
      {/* ✅ Custom Header Title */}
      <Stack.Screen options={{ title: '🏋️ Workout Tracker' }} />

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        <Text style={styles.title}>🌸 Workout Tracker</Text>

        {/* Calendar */}
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            ...Object.keys(trackedWorkouts).reduce((acc, date) => {
              acc[date] = { marked: true, dotColor: '#ff4d94' };
              return acc;
            }, {}),
            [selectedDate]: { selected: true, selectedColor: '#ff4d94' },
          }}
          theme={{ calendarBackground: '#ffe6f2', textSectionTitleColor: '#d6336c' }}
        />

        <Text style={styles.subTitle}>{selectedDate ? `Selected Date: ${selectedDate}` : 'Pick a date to track a workout'}</Text>

        {/* Saved Workouts Section */}
        <Text style={styles.subTitle}>💾 Choose a Saved Workout</Text>
        {savedWorkouts.map((workout) => (
          <View key={workout.id} style={styles.muscleGroupContainer}>
            <TouchableOpacity style={styles.muscleGroupItem} onPress={() => toggleSavedWorkout(workout.id)}>
              <Text style={styles.muscleGroupText}>{workout.name}</Text>
              <Ionicons name={expandedSavedWorkouts[workout.id] ? "chevron-up" : "chevron-down"} size={20} color="#d6336c" />
            </TouchableOpacity>

            {/* Dropdown for Saved Workouts */}
            {expandedSavedWorkouts[workout.id] && (
              <View style={styles.exerciseDropdown}>
                <Text style={styles.exerciseDropdownTitle}>🏋️ Exercises in {workout.name}</Text>
                {workout.exercises.map((exercise, index) => (
                  <TouchableOpacity key={index} style={styles.exerciseItem} onPress={() => startWorkout(exercise)}>
                    <Text style={styles.exerciseText}>{exercise}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffe6f2' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ff4d94', textAlign: 'center', marginBottom: 15 },
  subTitle: { fontSize: 20, fontWeight: 'bold', color: '#d6336c', textAlign: 'center', marginVertical: 10 },

  muscleGroupContainer: { marginBottom: 10 },
  muscleGroupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#ffcce6',
    borderRadius: 10,
    alignItems: 'center',
  },
  muscleGroupText: { fontSize: 18, fontWeight: 'bold', color: '#d6336c' },
  exerciseDropdown: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#ffebf2',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#ff4d94',
  },
  exerciseDropdownTitle: { fontSize: 16, fontWeight: 'bold', color: '#d6336c', marginBottom: 5 },
  exerciseItem: { padding: 10, marginVertical: 3, backgroundColor: '#ffd6e0', borderRadius: 8 },
  exerciseText: { fontSize: 16, color: '#d6336c' },
  loggedWorkouts: { marginTop: 20, padding: 15, backgroundColor: '#ffe6f2', borderRadius: 10 },
  endWorkoutButton: { backgroundColor: '#ff4d94', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  addButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

