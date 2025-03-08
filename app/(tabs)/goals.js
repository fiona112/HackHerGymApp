import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function GoalsScreen() {
  // Mock goals list
  const [goals, setGoals] = useState([
    { id: '1', text: 'Drink 2L of Water', completed: false, points: 10 },
    { id: '2', text: 'Eat Three Healthy Meals', completed: false, points: 15 },
    { id: '3', text: 'Exercise for 30 Minutes', completed: false, points: 20 },
    { id: '4', text: 'Sleep 8 Hours', completed: false, points: 10 },
  ]);

  // Mock leaderboard data
  const [leaderboard, setLeaderboard] = useState([
    { id: '1', name: 'You', points: 0 },
    { id: '2', name: 'Alex', points: 50 },
    { id: '3', name: 'Jamie', points: 40 },
    { id: '4', name: 'Taylor', points: 30 },
  ]);

  // Function to complete a goal and earn points
  const completeGoal = (goalId, goalPoints) => {
    setGoals(goals.map(goal =>
      goal.id === goalId ? { ...goal, completed: true } : goal
    ));

    setLeaderboard(leaderboard.map(player =>
      player.name === 'You' ? { ...player, points: player.points + goalPoints } : player
    ));

    Alert.alert('Goal Completed! 🎉', `You earned ${goalPoints} points!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Daily Goals</Text>

      {/* Goals List */}
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <Text style={[styles.goalText, item.completed && styles.completedText]}>{item.text}</Text>
            {!item.completed && (
              <TouchableOpacity style={styles.completeButton} onPress={() => completeGoal(item.id, item.points)}>
                <Text style={styles.buttonText}>Complete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* Leaderboard */}
      <Text style={styles.title}>🏅 Leaderboard</Text>
      <FlatList
        data={leaderboard.sort((a, b) => b.points - a.points)} // Sort by points
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.leaderboardItem}>
            <Text style={styles.leaderboardText}>{item.name} - {item.points} pts</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  goalItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, marginVertical: 5, backgroundColor: '#e9ecef', borderRadius: 5 },
  goalText: { fontSize: 16 },
  completedText: { textDecorationLine: 'line-through', color: 'gray' },
  completeButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  leaderboardItem: { padding: 10, backgroundColor: '#ddd', marginVertical: 3, borderRadius: 5 },
  leaderboardText: { fontSize: 16, fontWeight: 'bold' },
});
