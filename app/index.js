import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>🏋️ Gym Tracker</Text>
      <Button title="Workout Planner" onPress={() => router.push('/workoutplanner')} />
      <Button title="Find A Buddy" onPress={() => router.push('/findabuddy')} />
      <Button title="Goals" onPress={() => router.push('/goals')} />
      <Button title="Gym Status" onPress={() => router.push('/gymstatus')} />
    </View>
  );
}
