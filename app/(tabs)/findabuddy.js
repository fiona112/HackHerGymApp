import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, Animated, PanResponder, TextInput, FlatList } from 'react-native';

// Mock list of gym buddies with training focus
export default function FindABuddy() {
  const [buddies, setBuddies] = useState([
    { id: '1', name: 'Hailey', location: 'Arc', trainingFocus: 'Chest', image: 'https://via.placeholder.com/100' },
    { id: '2', name: 'Fiona', location: 'GoodLife Fitness', trainingFocus: 'Legs', image: 'https://via.placeholder.com/100' },
    { id: '3', name: 'Emma', location: 'Arc', trainingFocus: 'Arms', image: 'https://via.placeholder.com/100' },
    { id: '4', name: 'bob the builder', location: 'Arc', trainingFocus: 'Back', image: 'https://via.placeholder.com/100' },
  ]);

  const [currentBuddyIndex, setCurrentBuddyIndex] = useState(0);
  const [isEndOfList, setIsEndOfList] = useState(false);
  const [matchedBuddy, setMatchedBuddy] = useState(null); // To track matched buddy
  const [message, setMessage] = useState(''); // To store the message input
  const [messages, setMessages] = useState([]); // To store sent messages for the matched buddy

  // Gesture recognition for swipe
  const pan = new Animated.ValueXY();

  const handleSwipe = (direction) => {
    if (isEndOfList) {
      Alert.alert('No More Buddies', 'You have swiped through all the gym buddies!');
      return;
    }

    const buddy = buddies[currentBuddyIndex];
    if (direction === 'right') {
      setMatchedBuddy(buddy); // Set the matched buddy if liked
      Alert.alert('Buddy Liked 💖', `You matched with ${buddy.name}!`);
    } else if (direction === 'left') {
      Alert.alert('Buddy Disliked 💔', `You disliked ${buddy.name}!`);
    }

    if (currentBuddyIndex + 1 >= buddies.length) {
      setIsEndOfList(true);
    } else {
      setCurrentBuddyIndex(currentBuddyIndex + 1);
    }

    pan.setValue({ x: 0, y: 0 }); // Reset pan after swipe
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
        <Image source={{ uri: buddy.image }} style={styles.buddyImage} />
        <View style={styles.buddyInfo}>
          <Text style={styles.buddyText}>{buddy.name}</Text>
          <Text style={styles.buddyText}>{buddy.location}</Text>
          <Text style={styles.buddyText}>Training Focus: {buddy.trainingFocus}</Text>
        </View>
      </Animated.View>
    );
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        from: 'You',
        to: matchedBuddy.name, // Include the recipient's name
        time: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, newMessage]);
      setMessage(''); // Reset message after sending
    } else {
      Alert.alert('Message Required', 'Please enter a message to send.');
    }
  };

  const renderMessages = () => {
    return (
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.messageItem}>
            <Text style={styles.messageText}>
              <Text style={styles.sender}>{item.from}</Text> to <Text style={styles.receiver}>{item.to}</Text>: {item.text}
            </Text>
            <Text style={styles.messageTime}>{item.time}</Text>
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find a Gym Buddy 💖</Text>

      {renderBuddy()}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.dislikeButton, isEndOfList && styles.disabledButton]}
          onPress={() => handleSwipe('left')}
          disabled={isEndOfList}
        >
          <Text style={styles.buttonText}>Dislike</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.likeButton, isEndOfList && styles.disabledButton]}
          onPress={() => handleSwipe('right')}
          disabled={isEndOfList}
        >
          <Text style={styles.buttonText}>Like</Text>
        </TouchableOpacity>
      </View>

      {isEndOfList && <Text style={styles.endText}>No more gym buddies to show!</Text>}

      {matchedBuddy && (
        <View style={styles.messageContainer}>
          <Text style={styles.matchText}>It's a match! 🎉</Text>
          {renderMessages()}
          <TextInput
            style={styles.messageInput}
            placeholder={`Send a message to ${matchedBuddy.name}`}
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendMessageButton} onPress={handleSendMessage}>
            <Text style={styles.buttonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#ffe6f2',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '600',
    color: '#ff4d94',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Poppins',
  },
  buddyItem: {
    flexDirection: 'row',
    padding: 20,
    marginVertical: 15,
    backgroundColor: '#ffcce6',
    borderRadius: 20,
    shadowColor: '#ff4d94',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buddyInfo: { 
    flex: 1, 
    marginLeft: 20, 
    alignItems: 'center',
  },
  buddyText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#d6336c',
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginBottom: 10,
  },
  buddyImage: { width: 100, height: 100, borderRadius: 50 },

  buttonsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center',
    marginTop: 30,
  },
  likeButton: { 
    backgroundColor: '#ff4d94', 
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 30, 
    marginRight: 20,
    shadowColor: '#ff4d94', 
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  dislikeButton: { 
    backgroundColor: '#f44336', 
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 30, 
    marginLeft: 20,
    shadowColor: '#f44336', 
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  disabledButton: { opacity: 0.5 },
  buttonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold', 
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  endText: { fontSize: 20, color: '#ff4d94', fontWeight: '600', marginTop: 20 },
  messageContainer: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#ff4d94',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  matchText: { fontSize: 20, fontWeight: '600', color: '#ff4d94', textAlign: 'center', marginBottom: 20 },
  messageInput: {
    height: 40,
    borderColor: '#ff4d94',
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 10,
    paddingLeft: 10,
    fontSize: 16,
  },
  sendMessageButton: {
    backgroundColor: '#ff4d94',
    paddingVertical: 10,
    borderRadius: 30,
    marginTop: 15,
    alignItems: 'center',
    shadowColor: '#ff4d94', 
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  messageItem: { 
    marginBottom: 10, 
    padding: 10, 
    backgroundColor: '#ffebf2', 
    borderRadius: 15,
  },
  messageText: {
    fontSize: 16, 
    color: '#d6336c',
  },
  sender: { fontWeight: 'bold' },
  receiver: { fontWeight: 'bold', color: '#ff4d94' },
  messageTime: { fontSize: 12, color: '#a8a8a8', marginTop: 5, textAlign: 'right' },
});