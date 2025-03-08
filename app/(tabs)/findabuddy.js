import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

export default function FindABuddy() {
  const router = useRouter();

  const [buddies, setBuddies] = useState([
    { id: '1', name: 'Hailey', location: 'Arc', trainingFocus: 'Chest', image: require('../../assets/images/test.jpeg') },
    { id: '2', name: 'Fiona', location: 'Arc', trainingFocus: 'Legs', image: require('../../assets/images/test2.jpeg') },
    { id: '3', name: 'Emma', location: 'Arc', trainingFocus: 'Arms', image: require('../../assets/images/test3.jpeg') },
    { id: '4', name: 'Bob the Builder', location: 'Arc', trainingFocus: 'Back', image: require('../../assets/images/test4.jpeg') },
  ]);

  const [currentBuddyIndex, setCurrentBuddyIndex] = useState(0);
  const [matchedBuddies, setMatchedBuddies] = useState([]); 
  const [isEndOfList, setIsEndOfList] = useState(false);

  const handleSwipe = (direction) => {
    if (isEndOfList) return;

    const buddy = buddies[currentBuddyIndex];

    if (direction === 'right') {
      setMatchedBuddies([...matchedBuddies, buddy]);
      Alert.alert('Matched! 🎉', `You matched with ${buddy.name}!`);
    } else if (direction === 'left') {
      Alert.alert('Buddy Disliked 💔', `You disliked ${buddy.name}!`);
    }

    moveToNextBuddy();
  };

  const moveToNextBuddy = () => {
    if (currentBuddyIndex + 1 >= buddies.length) {
      setIsEndOfList(true);
    } else {
      setCurrentBuddyIndex(currentBuddyIndex + 1);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: '💖 Find a Gym Buddy' }} />

      <View style={styles.container}>
        <Text style={styles.title}>Find a Gym Buddy 💖</Text>

        {!isEndOfList ? (
          <View style={styles.buddyItem}>
            <Image source={buddies[currentBuddyIndex].image} style={styles.buddyImage} />
            <Text style={styles.buddyText}>{buddies[currentBuddyIndex].name}</Text>
            <Text style={styles.buddyText}>{buddies[currentBuddyIndex].location}</Text>
            <Text style={styles.buddyText}>Training Focus: {buddies[currentBuddyIndex].trainingFocus}</Text>
          </View>
        ) : (
          <Text style={styles.endText}>No more gym buddies at the moment! 😞</Text>
        )}

        {!isEndOfList && (
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.dislikeButton} onPress={() => handleSwipe('left')}>
              <Text style={styles.buttonText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.likeButton} onPress={() => handleSwipe('right')}>
              <Text style={styles.buttonText}>Match</Text>
            </TouchableOpacity>
          </View>
        )}

        {matchedBuddies.length > 0 && (
          <TouchableOpacity 
            style={styles.chatButton} 
            onPress={() => router.push({ pathname: '/chatscreen', params: { matchedBuddies: JSON.stringify(matchedBuddies) } })}
          >
            <Text style={styles.buttonText}>💬 Show Chats</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffe6f2', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: 'bold', color: 'black', marginBottom: 20 },
  buddyItem: { alignItems: 'center', backgroundColor: '#ffcce6', padding: 20, borderRadius: 20, width: '90%' },
  buddyImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 10 },
  buddyText: { fontSize: 18, fontWeight: 'bold', color: '#d6336c' },
  buttonsContainer: { flexDirection: 'row', marginTop: 20 },
  likeButton: { backgroundColor: '#ff4d94', padding: 15, borderRadius: 20, marginHorizontal: 10 },
  dislikeButton: { backgroundColor: '#f44336', padding: 15, borderRadius: 20, marginHorizontal: 10 },
  chatButton: { backgroundColor: '#ff4d94', padding: 15, borderRadius: 20, marginTop: 20 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  endText: { fontSize: 20, fontWeight: 'bold', color: '#d6336c', marginTop: 30, textAlign: 'center' },
});
