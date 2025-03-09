import { Stack, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      <Stack.Screen options={{ title: '💖 ARChieve' }} />

      <View style={styles.container}>
        {userName ? (
          <Text style={styles.welcomeText}>Welcome, {userName}! 👋</Text>
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/loginscreen')}>
            <Text style={styles.loginButtonText}>🔐 Login / Register</Text>
          </TouchableOpacity>
        )}

        {/* Neon Highlighted Buttons */}
        {menuItems.map((item, index) => (
          <NeonButton key={index} title={item.title} icon={item.icon} onPress={() => router.push(item.route)} />
        ))}

        {userName && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>🚪 Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

// Menu items with titles, routes, and icons
const menuItems = [
  { title: "📋 Workout Planner", route: "/workoutplanner", icon: "📋" },
  { title: "📅 Workout Tracker", route: "/workouttracker", icon: "📅" },
  { title: "🤝 Find A Buddy", route: "/findabuddy", icon: "🤝" },
  { title: "🎯 Goals", route: "/goals", icon: "🎯" },
  { title: "📊 Gym Status", route: "/gymstatus", icon: "📊" },
  { title: "🍔 Meal Tracker", route: "/mealtrack", icon: "🍔" },
];

// Neon Button Component (Animated Glow Effect)
const NeonButton = ({ title, onPress }) => {
  const scaleAnim = useState(new Animated.Value(1))[0];

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    onPress();
  };

  return (
    <Animated.View style={[styles.neonButtonContainer, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.neonButton}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <Text style={styles.neonButtonText}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffe6f2', justifyContent: 'center', alignItems: 'center', padding: 20 },

  welcomeText: { fontSize: 26, fontWeight: 'bold', color: '#ff4d94', marginBottom: 25, textAlign: 'center' },

  loginButton: { backgroundColor: '#ff4d94', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, marginBottom: 30, width: '90%', alignItems: 'center' },
  loginButtonText: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },

  neonButtonContainer: {
    marginVertical: 8,
    borderRadius: 25,
    width: '85%',
    shadowColor: '#ff4d94',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },

  neonButton: {
    backgroundColor: '#ff99c8',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ff4d94',
  },

  neonButtonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 77, 148, 1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
  },

  logoutButton: { backgroundColor: '#ff99c8', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, marginTop: 30 },
  logoutButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffe6f2' },
});

