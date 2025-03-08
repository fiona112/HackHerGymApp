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
    Alert.alert('Request Sent', `You sent a request to gym with ${name}! 💪`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find a Gym Buddy 🤝</Text>

      <FlatList
        data={buddies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.buddyItem}>
            <Text style={styles.buddyText}>{item.name} - {item.location}</Text>
            <TouchableOpacity style={styles.requestButton} onPress={() => sendRequest(item.name)}>
              <Text style={styles.buttonText}>Request</Text>
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
  buddyItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, marginVertical: 5, backgroundColor: '#e9ecef', borderRadius: 5 },
  buddyText: { fontSize: 16 },
  requestButton: { backgroundColor: '#00    7bff', padding: 10, borderRadius: 5 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
