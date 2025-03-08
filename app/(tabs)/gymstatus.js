import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GymStatusScreen() {
  const [status, setStatus] = useState('Loading...'); // Default state
  const [lastUpdated, setLastUpdated] = useState('');

  // Mock function to get gym status (this can later be replaced with an API call)
  const getGymStatus = () => {
    const statuses = ['Not Busy 🟢', 'Moderate 🟡', 'Busy 🔴'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    setStatus(randomStatus);
    setLastUpdated(new Date().toLocaleTimeString());
  };

  // Fetch gym status when the page loads
  useEffect(() => {
    getGymStatus();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏋️ Arc Status</Text>
      <Text style={styles.statusText}>{status}</Text>
      <Text style={styles.updatedText}>Last Updated: {lastUpdated}</Text>

      <TouchableOpacity style={styles.refreshButton} onPress={getGymStatus}>
        <Text style={styles.buttonText}>Refresh Status</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  statusText: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  updatedText: { fontSize: 14, color: 'gray', marginBottom: 20 },
  refreshButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 5 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
