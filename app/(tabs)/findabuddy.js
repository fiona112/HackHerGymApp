import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function FindABuddy() {
  // Mock list of available gym buddies
  const [buddies, setBuddies] = useState([
    { id: '1', name: 'Alex', location: 'Arc' },
    { id: '2', name: 'Jamie', location: 'GoodLife Fitness' },
    { id: '3', name: 'Taylor', location: 'Arc' },
    { id: '4', name: 'Jordan', location: 'Arc' },
  ]);

  // Function to handle sending a buddy request
  const sendRequest = (name) => {
    Alert.alert('Request Sent 💖', `You sent a request to gym with ${name}! 💪`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💖 Find a Gym Buddy 🤝</Text>

      <FlatList
        data={buddies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.buddyItem}>
            <Text style={styles.buddyText}>{item.name} - {item.location}</Text>
            <TouchableOpacity style={styles.requestButton} onPress={() => sendRequest(item.name)}>
              <Text style={styles.buttonText}>Request 💌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffe6f2' }, // Soft pink background
  title: { fontSize: 28, fontWeight: 'bold', color: '#ff4d94', textAlign: 'center', marginBottom: 20 },

  buddyItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 15, 
    marginVertical: 6, 
    backgroundColor: '#ffcce6', // Light pink for buddy cards
    borderRadius: 15, 
    shadowColor: '#ff4d94', 
    shadowOffset: { width: 2, height: 3 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 4 
  },

  buddyText: { fontSize: 18, fontWeight: 'bold', color: '#d6336c' },

  requestButton: { 
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
});
