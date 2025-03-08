import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in (fetch stored user session)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('userEmail');
        const storedName = await AsyncStorage.getItem('userName');

        if (storedEmail && storedName) {
          setUserEmail(storedEmail);
          setUserName(storedName);
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  // Logout function (Clears user session)
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userEmail');
    await AsyncStorage.removeItem('userName');
    setUserEmail(null);
    setUserName(null);
    router.push('/loginscreen'); // Redirect to login page after logout
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4d94" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: '💖 Gym Tracker' }} />

      <View style={styles.container}>
        {/* Show user's name at the top if logged in */}
        {userName ? (
          <Text style={styles.welcomeText}>Welcome, {userName}! 👋</Text>
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/loginscreen')}>
            <Text style={styles.loginButtonText}>🔐 Login / Register</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={() => router.push('/workoutplanner')}>
          <Text style={styles.buttonText}>📋 Workout Planner</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/workouttracker')}>
          <Text style={styles.buttonText}>📅 Workout Tracker</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/findabuddy')}>
          <Text style={styles.buttonText}>🤝 Find A Buddy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/goals')}>
          <Text style={styles.buttonText}>🎯 Goals</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/gymstatus')}>
          <Text style={styles.buttonText}>📊 Gym Status</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/mealtrack')}>
          <Text style={styles.buttonText}>🍔 Meal Tracker</Text>
        </TouchableOpacity>


        {userName && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>🚪 Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffe6f2', justifyContent: 'center', alignItems: 'center', padding: 20 },

  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#ff4d94', marginBottom: 20, textAlign: 'center' },

  loginButton: { backgroundColor: '#ff4d94', paddingVertical: 20, paddingHorizontal: 40, borderRadius: 30, marginBottom: 30, width: '90%', alignItems: 'center' },
  loginButtonText: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },

  button: { backgroundColor: '#ff99c8', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, marginVertical: 10, width: '80%', alignItems: 'center' },
  buttonText: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },

  logoutButton: { backgroundColor: '#ff99c8', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, marginTop: 20 },
  logoutButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffe6f2' },
});
