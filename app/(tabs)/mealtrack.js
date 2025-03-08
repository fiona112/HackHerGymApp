import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";

export default function MealTrackerScreen() {
  const today = format(new Date(), "yyyy-MM-dd"); // Get today's date
  const [selectedDate, setSelectedDate] = useState(today); // Track selected day
  const [meals, setMeals] = useState({});
  const [mealType, setMealType] = useState("Breakfast");
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");

  useEffect(() => {
    loadMeals();
  }, []);

  // Load saved meals from AsyncStorage
  const loadMeals = async () => {
    try {
      const storedMeals = await AsyncStorage.getItem("meals");
      if (storedMeals) {
        setMeals(JSON.parse(storedMeals));
      }
    } catch (error) {
      console.error("Failed to load meals:", error);
    }
  };

  // Save meals to AsyncStorage
  const saveMeals = async (updatedMeals) => {
    try {
      await AsyncStorage.setItem("meals", JSON.stringify(updatedMeals));
    } catch (error) {
      console.error("Failed to save meals:", error);
    }
  };

  // Add new meal to the current day's log
  const addMeal = () => {
    if (!food || !calories || !protein) return;

    const newMeal = { 
      id: Date.now().toString(), 
      mealType, 
      food, 
      calories: parseInt(calories), 
      protein: parseInt(protein) 
    };

    const updatedMeals = { 
      ...meals, 
      [selectedDate]: [...(meals[selectedDate] || []), newMeal] 
    };

    setMeals(updatedMeals);
    saveMeals(updatedMeals);

    setFood("");
    setCalories("");
    setProtein("");
  };

  // Calculate total calories & protein for the selected day
  const totalCalories = (meals[selectedDate] || []).reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = (meals[selectedDate] || []).reduce((sum, meal) => sum + meal.protein, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🍽️ Meal Tracker</Text>

      {/* Meal Type Picker */}
      <Text style={styles.label}>Select Meal Type</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={mealType} onValueChange={(itemValue) => setMealType(itemValue)} style={styles.picker}>
          <Picker.Item label="Breakfast 🍳" value="Breakfast" />
          <Picker.Item label="Lunch 🥗" value="Lunch" />
          <Picker.Item label="Dinner 🍽️" value="Dinner" />
          <Picker.Item label="Snack 🍎" value="Snack" />
        </Picker>
      </View>

      {/* Meal Input Form */}
      <TextInput style={styles.input} placeholder="Food Name" value={food} onChangeText={setFood} placeholderTextColor="#ff80ab"/>
      <TextInput style={styles.input} placeholder="Calories" keyboardType="numeric" value={calories} onChangeText={setCalories} placeholderTextColor="#ff80ab"/>
      <TextInput style={styles.input} placeholder="Protein (g)" keyboardType="numeric" value={protein} onChangeText={setProtein} placeholderTextColor="#ff80ab"/>

      <TouchableOpacity style={styles.addButton} onPress={addMeal}>
        <Text style={styles.buttonText}>Add Meal 🍎</Text>
      </TouchableOpacity>

      {/* Summary of daily intake */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>🔥 Total Calories: {totalCalories} kcal</Text>
        <Text style={styles.summaryText}>💪 Total Protein: {totalProtein}g</Text>
      </View>

      {/* Meal List for Selected Day */}
      <Text style={styles.header}>📅 {selectedDate}'s Meals</Text>
      <FlatList
        data={meals[selectedDate] || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mealItem}>
            <Text style={styles.mealTitle}>🍽️ {item.mealType}</Text>
            <Text style={styles.mealText}>{item.food}</Text>
            <Text style={styles.mealStats}>🔥 {item.calories} kcal | 💪 {item.protein}g Protein</Text>
          </View>
        )}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#ffe6f2' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#ff4d94', textAlign: 'center', marginBottom: 15 },
  label: { fontSize: 16, fontWeight: "bold", color: "#ff4d94", marginBottom: 5 },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ff4d94",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },

  picker: {
    height: 50,
    color: "#ff4d94",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ff4d94",
    padding: 12,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    color: "#ff4d94",
  },

  addButton: { 
    backgroundColor: '#ff4d94', 
    paddingVertical: 12, 
    borderRadius: 20, 
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#ff4d94',
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  summaryContainer: {
    backgroundColor: "#ffcce6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },

  summaryText: { fontSize: 18, fontWeight: "bold", color: "#d6336c" },

  mealItem: { 
    backgroundColor: "#ffcce6",
    padding: 15,
    marginVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ff99c8",
    shadowColor: "#ff4d94",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  mealTitle: { fontSize: 18, fontWeight: "bold", color: "#d6336c" },
  mealText: { fontSize: 16, color: "#d6336c", marginTop: 3 },
  mealStats: { fontSize: 14, color: "#ff4d94", marginTop: 2, fontWeight: "bold" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});


