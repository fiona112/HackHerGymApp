import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function GoalsScreen() {
  // Mock goals list
  const [goals, setGoals] = useState([
    { id: '1', text: 'Drink 2L of Water 💧', completed: false, points: 10 },
    { id: '2', text: 'Eat Three Healthy Meals 🥗', completed: false, points: 15 },
    { id: '3', text: 'Exercise for 30 Minutes 🏋️‍♀️', completed: false, points: 20 },
    { id: '4', text: 'Sleep 8 Hours 😴', completed: false, points: 10 },
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

    Alert.alert('✨ Goal Completed! ✨', `You earned ${goalPoints} points! 🎉`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌟 Daily Goals</Text>

      {/* Goals List */}
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <Text style={[styles.goalText, item.completed && styles.completedText]}>{item.text}</Text>
            {!item.completed && (
              <TouchableOpacity style={styles.completeButton} onPress={() => completeGoal(item.id, item.points)}>
                <Text style={styles.buttonText}>✅ Complete</Text>
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
        renderItem={({ item, index }) => (
          <View style={[styles.leaderboardItem, index === 0 && styles.firstPlace]}>
            <Text style={styles.leaderboardText}>
              {index === 0 ? '🥇 ' : index === 1 ? '🥈 ' : index === 2 ? '🥉 ' : ''} 
              {item.name} - {item.points} pts
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffe6f2' }, // Soft pink background
  title: { fontSize: 28, fontWeight: 'bold', color: '#ff4d94', textAlign: 'center', marginBottom: 20 },

  goalItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 15, 
    marginVertical: 6, 
    backgroundColor: '#ffcce6', // Light pink for goal cards
    borderRadius: 15, 
    shadowColor: '#ff4d94', 
    shadowOffset: { width: 2, height: 3 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 4 
  },

  goalText: { fontSize: 18, fontWeight: 'bold', color: '#d6336c' },
  completedText: { textDecorationLine: 'line-through', color: 'gray' },

  completeButton: { 
    backgroundColor: '#ff4d94', 
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    borderRadius: 20, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  leaderboardItem: { 
    padding: 12, 
    backgroundColor: '#ffcce6', 
    marginVertical: 3, 
    borderRadius: 10,
    alignItems: 'center',
  },

  firstPlace: { 
    backgroundColor: '#ff99c8', // Brighter pink for 1st place
  },

  leaderboardText: { fontSize: 18, fontWeight: 'bold', color: '#d6336c' },
});
