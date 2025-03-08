import { Stack } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';

export default function GymStatusScreen() {
  const [status, setStatus] = useState('Loading...');
  const [lastUpdated, setLastUpdated] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [hours, setHours] = useState([]);

  const getGymStatus = () => {
    const statuses = ['Not Busy 🩷', 'Moderate 💛', 'Busy 💚'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    setStatus(randomStatus);
    setLastUpdated(new Date().toLocaleTimeString());
  };

  const generateHourlyData = (day) => {
    const isWeekend = day === 'Fri' || day === 'Sat';
    const closingHour = isWeekend ? 22 : 23; // 10PM on weekends, 11PM on weekdays

    const timeSlots = Array.from({ length: closingHour - 6 + 1 }, (_, i) => {
      const hour = 6 + i;
      return `${hour <= 11 ? hour : hour - 12}${hour < 12 ? 'AM' : 'PM'}`;
    });

    const data = timeSlots.map((hour, index) => {
      if (index >= 2 && index <= 11) {
        return Math.floor(Math.random() * (80 - 50) + 50); // Busier from 8AM to 5PM (50-80%)
      }
      return Math.floor(Math.random() * (50 - 10) + 10); // Less busy early/late (10-50%)
    });

    setHours(timeSlots);
    setHourlyData(data);
    setSelectedDay(day);
  };

  useEffect(() => {
    getGymStatus();
  }, []);

  const screenWidth = Dimensions.get('window').width - 20;
  const chartHeight = 280;
  const maxBarHeight = 200;
  const barWidth = 18;
  const barSpacing = (screenWidth - 40) / hours.length;

  // Get the current day & current hour
  const currentDay = new Date().toLocaleString('en-US', { weekday: 'short' }); // E.g., "Mon", "Tue", etc.
  const currentHour = new Date().getHours();

  return (
    <>
      <Stack.Screen options={{ title: '📊 Gym Status' }} />

      <View style={styles.container}>
        <Text style={styles.title}>🏋️ Arc Status</Text>
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
        <Text style={styles.updatedText}>Last Updated: {lastUpdated}</Text>

        <TouchableOpacity style={styles.refreshButton} onPress={getGymStatus}>
          <Text style={styles.buttonText}>🔄 Refresh Status</Text>
        </TouchableOpacity>

        <Text style={styles.chartTitle}>📅 Select a Day</Text>
        <View style={styles.dayButtons}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <TouchableOpacity key={day} style={styles.dayButton} onPress={() => generateHourlyData(day)}>
              <Text style={styles.dayText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedDay && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>📊 {selectedDay} Hourly Traffic</Text>
            <Svg width={screenWidth} height={chartHeight + 40}>
              {/* Grid Lines */}
              {[0, 25, 50, 75, 100].map((y, i) => (
                <Line
                  key={i}
                  x1={10}
                  y1={chartHeight - (y * maxBarHeight) / 100}
                  x2={screenWidth - 10}
                  y2={chartHeight - (y * maxBarHeight) / 100}
                  stroke="lightgray"
                  strokeWidth={1}
                />
              ))}

              {/* Bars */}
              {hourlyData.map((value, index) => {
                const barHeight = (value * maxBarHeight) / 100;
                const hourValue = parseInt(hours[index]); // Extract number from "6AM", "7PM", etc.
                const isPM = hours[index].includes('PM');
                const convertedHour = isPM && hourValue !== 12 ? hourValue + 12 : hourValue; // Convert to 24-hour format

                return (
                  <Rect
                    key={index}
                    x={index * barSpacing + 20}
                    y={chartHeight - barHeight}
                    width={barWidth}
                    height={barHeight}
                    rx={9}
                    ry={9}
                    fill={selectedDay === currentDay && convertedHour === currentHour ? 'red' : '#ff4d94'} // Only red if it's the current day + hour
                  />
                );
              })}

              {/* Hour Labels */}
              {hours.map((hour, index) => (
                <SvgText
                  key={index}
                  x={index * barSpacing + 30}
                  y={chartHeight + 25}
                  fontSize="10"
                  fill="#ff4d94"
                  textAnchor="middle"
                >
                  {hour}
                </SvgText>
              ))}
            </Svg>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffe6f2', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ff4d94', textAlign: 'center', marginBottom: 20, marginTop: 50},
  statusBox: { backgroundColor: '#ffcce6', padding: 20, borderRadius: 20, marginBottom: 10 },
  statusText: { fontSize: 22, fontWeight: 'bold', color: '#d6336c', textAlign: 'center' },
  updatedText: { fontSize: 14, color: 'gray', marginBottom: 15 },
  refreshButton: { backgroundColor: '#ff4d94', padding: 12, borderRadius: 20, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  chartTitle: { fontSize: 20, fontWeight: 'bold', color: '#ff4d94', marginTop: 20, marginBottom: 10 },
  dayButtons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10 },
  dayButton: { backgroundColor: '#ff99c2', padding: 10, margin: 5, borderRadius: 10 },
  dayText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  chartContainer: { alignItems: 'center', marginTop: 10 },
});