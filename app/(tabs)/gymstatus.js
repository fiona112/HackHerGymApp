import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GymStatusScreen() {
  const [status, setStatus] = useState('Loading...'); // Default state
  const [lastUpdated, setLastUpdated] = useState('');

  // Mock function to get gym status (this can later be replaced with an API call)
  const getGymStatus = () => {
    const statuses = ['Not Busy 💚 ', 'Moderate 💛', 'Busy ❤️'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    setStatus(randomStatus);
    setLastUpdated(new Date().toLocaleTimeString());
  };

  // Fetch gym status when the page loads
  useEffect(() => {
    getGymStatus();
  }, []);

  return (
    <>
      {/* ✅ Set Custom Title Here */}
      <Stack.Screen options={{ title: '📊 Gym Status' }} />

      <View style={styles.container}>
        <Text style={styles.title}>🏋️ Arc Status</Text>
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <Text style={styles.updatedText}>Last Updated: {lastUpdated}</Text>

        <TouchableOpacity style={styles.refreshButton} onPress={getGymStatus}>
          <Text style={styles.buttonText}>🔄 Refresh Status</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#ffe6f2', // Soft pink background
    padding: 20
  },

  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#ff4d94', 
    textAlign: 'center', 
    marginBottom: 20 
  },

  statusBox: {
    backgroundColor: '#ffcce6', 
    paddingVertical: 20, 
    paddingHorizontal: 30, 
    borderRadius: 20, 
    shadowColor: '#ff4d94',
    shadowOffset: { width: 2, height: 3 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 5, 
    elevation: 5,
    marginBottom: 10
  },

  statusText: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#d6336c', 
    textAlign: 'center' 
  },

  updatedText: { 
    fontSize: 16, 
    color: 'gray', 
    marginBottom: 20 
  },

  refreshButton: { 
    backgroundColor: '#ff4d94', 
    paddingVertical: 12, 
    paddingHorizontal: 25, 
    borderRadius: 25, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  buttonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});
