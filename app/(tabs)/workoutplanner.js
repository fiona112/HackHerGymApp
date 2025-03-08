import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function WorkoutPlanner() {
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [workoutList, setWorkoutList] = useState([]);

  const addWorkout = () => {
    if (exercise.trim() && sets.trim() && reps.trim()) {
      setWorkoutList([...workoutList, { id: Date.now().toString(), exercise, sets, reps }]);
      setExercise('');
      setSets('');
      setReps('');
    } else {
      alert('Please fill all fields!');
    }
  };

  const removeWorkout = (id) => {
    setWorkoutList(workoutList.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Planner 🏋️</Text>

      <TextInput
        placeholder="Exercise Name"
        value={exercise}
        onChangeText={setExercise}
        style={styles.input}
      />
      <TextInput
        placeholder="Sets"
        value={sets}
        onChangeText={setSets}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Reps"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Add Exercise" onPress={addWorkout} />

      <FlatList
        data={workoutList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.workoutItem}>
            <Text style={styles.workoutText}>{item.exercise} - {item.sets} sets x {item.reps} reps</Text>
            <TouchableOpacity onPress={() => removeWorkout(item.id)}>
              <Text style={styles.deleteButton}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, backgroundColor: 'white', borderRadius: 5 },
  workoutItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, marginTop: 10, backgroundColor: '#e9ecef', borderRadius: 5 },
  workoutText: { fontSize: 16 },
  deleteButton: { fontSize: 20, color: 'red' },
});
