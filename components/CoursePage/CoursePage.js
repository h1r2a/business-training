import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

export default function CoursePage() {
  const route = useRoute();
  const { course } = route.params; // Receive the course object passed from ModulesPage

  const [balance, setBalance] = useState(0);

  // Function to get the user's balance
  const getBalance = async () => {
    const profile = await AsyncStorage.getItem('profile');
    return profile ? JSON.parse(profile).balance : 0;
  };

  // Function to update the user's balance
  const updateBalance = async (newBalance) => {
    const profile = await AsyncStorage.getItem('profile');
    if (profile) {
      const userProfile = JSON.parse(profile);
      userProfile.balance = newBalance;
      await AsyncStorage.setItem('profile', JSON.stringify(userProfile));
    }
  };

  // Function to handle course subscription
  const handleSubscribe = async () => {
    const currentBalance = await getBalance();
    if (currentBalance >= course.fees) {
      const newBalance = currentBalance - course.fees;
      await updateBalance(newBalance); // Update the balance
      Alert.alert("Subscription successful!", `You've subscribed to ${course.name}.`);
    } else {
      Alert.alert("Insufficient funds", "You do not have enough funds to subscribe to this course.");
    }
  };

  // Fetch the initial balance on component mount
  useEffect(() => {
    const fetchBalance = async () => {
      const initialBalance = await getBalance();
      setBalance(initialBalance);
    };

    fetchBalance();
  }, []);

  // Render schedule for each course
  const renderScheduleItem = ({ item }) => (
    <View style={styles.scheduleItem}>
      <Text style={styles.scheduleText}>{`Date: ${item.date}`}</Text>
      <Text style={styles.scheduleText}>{`Time: ${item.time}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={course.image} style={styles.image} />
      <Text style={styles.title}>{course.name}</Text>
      <Text style={styles.description}>{course.description}</Text>
      <Text style={styles.price}>Price: ${course.fees}</Text>

      {/* Display the schedule */}
      <Text style={styles.scheduleTitle}> Sessions à venir:</Text>
      <FlatList
        data={course.schedule}
        renderItem={renderScheduleItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.scheduleList}
      />

      <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
        <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    color: '#4cd964',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  scheduleList: {
    marginBottom: 20,
  },
  scheduleItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  scheduleText: {
    fontSize: 16,
    color: '#333',
  },
  subscribeButton: {
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
