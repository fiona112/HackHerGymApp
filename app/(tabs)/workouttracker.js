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

      {/* Muscle Groups */}
      <Text style={styles.subTitle}>💪 Choose Muscle Group</Text>
      {Object.keys(muscleGroups).map((group) => (
        <View key={group} style={styles.muscleGroupContainer}>
          <TouchableOpacity style={styles.muscleGroupItem} onPress={() => toggleMuscleGroup(group)}>
            <Text style={styles.muscleGroupText}>{group}</Text>
            <Ionicons name={expandedMuscleGroups[group] ? "chevron-up" : "chevron-down"} size={20} color="#d6336c" />
          </TouchableOpacity>

          {/* Dropdown for Exercises */}
          {expandedMuscleGroups[group] && (
            <View style={styles.exerciseDropdown}>
              <Text style={styles.exerciseDropdownTitle}>💪 Exercises in {group}</Text>
              <FlatList
                data={muscleGroups[group]}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.exerciseItem} onPress={() => startWorkout(item)}>
                    <Text style={styles.exerciseText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
      ))}

      {/* Active Workout Session */}
      {currentExercise && (
        <View style={styles.workoutSession}>
          <Text style={styles.subTitle}>🚀 Tracking: {currentExercise}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter reps"
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter weight (lbs)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
          <TouchableOpacity style={styles.addButton} onPress={logSet}>
            <Text style={styles.addButtonText}>Add Set</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Display Logged Workouts */}
      {sets.length > 0 && (
        <View style={styles.loggedWorkouts}>
          <Text style={styles.subTitle}>📋 Workout Progress</Text>
          {Object.entries(
            sets.reduce((acc, { exercise, reps, weight }) => {
              acc[exercise] = acc[exercise] || [];
              acc[exercise].push({reps, weight});
              return acc;
            }, {})
          ).map(([exercise, repsList]) => (
            <View key={exercise} style={styles.exerciseLog}>
              <Text style={styles.exerciseLogTitle}>🏋️ {exercise}</Text>
              {repsList.map(({ reps, weight }, index) => (
                <Text key={index} style={styles.setLog}>
                    Set {index + 1}: {reps} reps {weight && weight !== '' ? `@ ${weight} lbs` : ''}
                </Text>
            ))}

            </View>
          ))}
        </View>
      )}

      {/* End & Save Workout Button */}
      {sets.length > 0 && (
        <TouchableOpacity style={styles.endWorkoutButton} onPress={endWorkoutAndSave}>
          <Text style={styles.addButtonText}>🏁 End & Save Workout</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffe6f2' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ff4d94', textAlign: 'center', marginBottom: 15 },
  subTitle: { fontSize: 20, fontWeight: 'bold', color: '#d6336c', textAlign: 'center', marginVertical: 10 },

  muscleGroupContainer: {
    marginBottom: 10,
  },
  muscleGroupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#ffcce6',
    borderRadius: 10,
    alignItems: 'center',
  },
  muscleGroupText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d6336c',
  },
  exerciseDropdown: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#ffebf2',
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#ff4d94',
  },
  exerciseDropdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d6336c',
    marginBottom: 5,
  },
  exerciseItem: {
    padding: 10,
    marginVertical: 3,
    backgroundColor: '#ffd6e0',
    borderRadius: 8,
  },
  exerciseText: {
    fontSize: 16,
    color: '#d6336c',
  },
  workoutSession: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#ffb3d9',
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d6336c',
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#ff4d94',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loggedWorkouts: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ffe6f2',
    borderRadius: 10,
  },
  exerciseLog: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ffcce6',
    borderRadius: 10,
  },
  exerciseLogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d6336c',
    marginBottom: 5,
  },
  setLog: {
    fontSize: 16,
    color: '#d6336c',
  },
  endWorkoutButton: {
    backgroundColor: '#ff4d94',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    },
});
