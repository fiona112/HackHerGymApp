import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Animated, PanResponder } from 'react-native';

// Mock list of gym buddies with training focus
export default function FindABuddy() {
  const [buddies, setBuddies] = useState([
    { id: '1', name: 'Hailey', location: 'Arc', trainingFocus: 'Chest', image: require('../../assets/images/test.jpeg') },
    { id: '2', name: 'Fiona', location: 'GoodLife Fitness', trainingFocus: 'Legs', image: 'https://via.placeholder.com/150' },
    { id: '3', name: 'Emma', location: 'Arc', trainingFocus: 'Arms', image: 'https://via.placeholder.com/150' },
    { id: '4', name: 'Bob the Builder', location: 'Arc', trainingFocus: 'Back', image: 'https://via.placeholder.com/150' },
  ]);

  const [currentBuddyIndex, setCurrentBuddyIndex] = useState(0);
  const [isEndOfList, setIsEndOfList] = useState(false);
  const [matchedBuddy, setMatchedBuddy] = useState(null);
  const [matchConfirmed, setMatchConfirmed] = useState(false); // NEW: Tracks if user acknowledged the match

  // Gesture recognition for swipe
  const pan = new Animated.ValueXY();

  const handleSwipe = (direction) => {
    if (isEndOfList) {
      Alert.alert('No More Buddies', 'You have swiped through all the gym buddies!');
      return;
    }

    const buddy = buddies[currentBuddyIndex];

    if (direction === 'right') {
      setMatchedBuddy(buddy);
      setMatchConfirmed(false); // Reset match confirmation
    } else if (direction === 'left') {
      Alert.alert('Buddy Disliked 💔', `You disliked ${buddy.name}!`);
      moveToNextBuddy(); // Move to next immediately on left swipe
    }

    pan.setValue({ x: 0, y: 0 });
  };

  const moveToNextBuddy = () => {
    if (currentBuddyIndex + 1 >= buddies.length) {
      setIsEndOfList(true);
    } else {
      setCurrentBuddyIndex(currentBuddyIndex + 1);
      setMatchedBuddy(null);
    }
  };

  const handleConfirmMatch = () => {
    setMatchConfirmed(true);
    setTimeout(moveToNextBuddy, 1500); // Move to next buddy after short delay
  };

  const handlePanResponderMove = Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false });

  const handlePanResponderRelease = (e, gestureState) => {
    if (gestureState.dx > 150) {
      handleSwipe('right');
    } else if (gestureState.dx < -150) {
      handleSwipe('left');
    } else {
      Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: handlePanResponderRelease,
  });

  const renderBuddy = () => {
    const buddy = buddies[currentBuddyIndex];
    if (!buddy) return null;

    return (
      <Animated.View
        style={[
          styles.buddyItem,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { rotate: pan.x.interpolate({ inputRange: [-300, 0, 300], outputRange: ['-30deg', '0deg', '30deg'] }) },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Image source={buddy.image} style={styles.buddyImage} />
        <View style={styles.buddyInfo}>
          <Text style={styles.buddyText}>{buddy.name}</Text>
          <Text style={styles.buddyText}>{buddy.location}</Text>
          <Text style={styles.buddyText}>Training Focus: {buddy.trainingFocus}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <>
      {/* ✅ Custom Header Title */}
      <Stack.Screen options={{ title: '💖 Find a Gym Buddy' }} />

      <View style={styles.container}>
        <Text style={styles.title}>Find a Gym Buddy 💖</Text>

        {renderBuddy()}

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.dislikeButton, isEndOfList && styles.disabledButton]}
            onPress={() => handleSwipe('left')}
            disabled={isEndOfList}
          >
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.likeButton, isEndOfList && styles.disabledButton]}
            onPress={() => handleSwipe('right')}
            disabled={isEndOfList}
          >
            <Text style={styles.buttonText}>Match</Text>
          </TouchableOpacity>
        </View>

        {isEndOfList && <Text style={styles.endText}>No more gym buddies to show!</Text>}

        {matchedBuddy && !matchConfirmed && (
          <View style={styles.notificationContainer}>
            <Text style={styles.notificationText}>
              🎉 {matchedBuddy.name} has been notified of your match!
            </Text>
            <TouchableOpacity style={styles.continueButton} onPress={handleConfirmMatch}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffe6f2', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 42, fontWeight: '600', color: '#ff4d94', textAlign: 'center', marginBottom: 30 },

  buddyItem: { 
    flexDirection: 'row',
    padding: 20,
    marginVertical: 15,
    backgroundColor: '#ffcce6',
    borderRadius: 20,
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center'
  },
  buddyImage: { width: 120, height: 120, borderRadius: 60, marginRight: 20 },
  buddyInfo: { flex: 1 },
  buddyText: { fontSize: 22, fontWeight: '500', color: '#d6336c', textAlign: 'left' },

  buttonsContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  likeButton: { backgroundColor: '#ff4d94', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30 },
  dislikeButton: { backgroundColor: '#f44336', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30 },
  disabledButton: { opacity: 0.5 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },

  notificationContainer: { 
    position: 'absolute', 
    bottom: 30, 
    backgroundColor: '#ffb3d9', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5
  },
  notificationText: { fontSize: 18, fontWeight: 'bold', color: '#d6336c' },
  continueButton: { marginTop: 10, backgroundColor: '#ff4d94', padding: 10, borderRadius: 10 },
});
