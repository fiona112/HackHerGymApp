import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuth = async () => {
    if (!email.endsWith('@queensu.ca')) {
      setErrorMessage('You must use a valid @queensu.ca email address.');
      return;
    }

    if (email === '' || password.length < 6) {
      setErrorMessage('Email is required & password must be at least 6 characters');
      return;
    }

    try {
      if (isRegister) {
        // Check if user exists
        const existingUser = await AsyncStorage.getItem(email);
        if (existingUser) {
          setErrorMessage('User already exists. Try logging in.');
          return;
        }

        // Save user credentials
        await AsyncStorage.setItem(email, JSON.stringify({ email, password }));
        alert('Account created! 🎉');
      } else {
        // Check if user exists & login
        const storedUser = await AsyncStorage.getItem(email);
        if (!storedUser) {
          setErrorMessage('User not found. Please register.');
          return;
        }

        const userData = JSON.parse(storedUser);
        if (userData.password !== password) {
          setErrorMessage('Incorrect password. Try again.');
          return;
        }

        alert('Logged in successfully ✅');
        router.push('/'); // Navigate to home after login
      }

      setErrorMessage('');
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <>
      {/* ✅ Add Header for Login/Register Page */}
      <Stack.Screen options={{ title: '🔐 Login / Register' }} />

      <View style={styles.container}>
        <Text style={styles.title}>{isRegister ? 'Create Account' : 'Welcome Back'}</Text>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email (must end with @queensu.ca)"
          placeholderTextColor="#ff4d94"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ff4d94"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
          <Text style={styles.authButtonText}>{isRegister ? 'Register' : 'Login'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
          <Text style={styles.switchText}>
            {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}> 
          <Text style={styles.backButtonText}>⬅️ Back to Home</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffe6f2', padding: 20 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#ff4d94', marginBottom: 20 },
  error: { color: 'red', fontSize: 14, marginBottom: 10 },
  input: {
    width: '90%',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ff4d94',
    color: '#ff4d94',
    fontSize: 16,
  },
  authButton: {
    backgroundColor: '#ff4d94',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#ff4d94',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  authButtonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  switchText: { color: '#ff4d94', fontSize: 16, marginTop: 15 },
  backButton: { marginTop: 30 },
  backButtonText: { color: '#ff4d94', fontSize: 18, fontWeight: 'bold' },
});
