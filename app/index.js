import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ title: '💖 Gym Tracker' }} />

      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1576678927484-cc9079570885' }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          {/* BIG LOGIN/REGISTER BUTTON */}
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/loginscreen')}>
            <Text style={styles.loginButtonText}>🔐 Login / Register</Text>
          </TouchableOpacity>

          <Text style={styles.title}>💖 Gym Tracker</Text>

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
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 192, 203, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
  },

  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#ff4d94',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },

  loginButton: {
    backgroundColor: '#ff4d94',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 30,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#ff4d94',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  loginButtonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: '#ff99c8',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#ff4d94',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});