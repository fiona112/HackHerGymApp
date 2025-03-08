import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

export default function ChatScreen() {
  const { matchedBuddies } = useLocalSearchParams();
  const buddies = matchedBuddies ? JSON.parse(matchedBuddies) : [];
  const [chats, setChats] = useState({});

  const sendMessage = (buddyId, message) => {
    if (!message.trim()) return;
    setChats((prevChats) => ({
      ...prevChats,
      [buddyId]: [...(prevChats[buddyId] || []), { text: message, sender: 'You' }],
    }));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: '💬 Chats' }} />
      <Text style={styles.header}>Gym Buddy Chats</Text>

      <FlatList
        data={buddies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.chatBox}>
            <Text style={styles.buddyName}>{item.name}</Text>
            <FlatList
              data={chats[item.id] || []}
              keyExtractor={(msg, index) => index.toString()}
              renderItem={({ item }) => <Text style={styles.message}>{item.sender}: {item.text}</Text>}
            />
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              onSubmitEditing={(event) => sendMessage(item.id, event.nativeEvent.text)}
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffe6f2' },
  header: { fontSize: 28, fontWeight: 'bold', color: '#ff4d94', textAlign: 'center', marginBottom: 20 },
  chatBox: { backgroundColor: '#ffcce6', padding: 15, marginVertical: 10, borderRadius: 10 },
  buddyName: { fontSize: 18, fontWeight: 'bold', color: '#d6336c' },
  message: { fontSize: 16, color: '#d6336c', marginTop: 5 },
  input: { borderWidth: 1, borderColor: '#ff4d94', padding: 10, borderRadius: 10, marginTop: 5 },
});

