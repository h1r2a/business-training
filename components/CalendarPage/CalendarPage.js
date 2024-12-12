import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalendarPage = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  // Fetch profile data from AsyncStorage
  const fetchProfileData = async () => {
    try {
      const data = await AsyncStorage.getItem('profile');
      const parsedData = JSON.parse(data);
      if (parsedData) {
        setProfileData(parsedData);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      Alert.alert("Error", "Unable to load profile data.");
    }
  };

  useEffect(() => {
    fetchProfileData();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfileData();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // Prepare marked dates once profile data is available
    if (profileData && profileData.courses) {
      const dates = {};
      profileData.courses.forEach(course => {
        if (course.schedule) {
          course.schedule.forEach(scheduleItem => {
            if (scheduleItem.date) {
              dates[scheduleItem.date] = { marked: true, dotColor: 'red' };
            }
          });
        }
      });
      setMarkedDates(dates);
    }
  }, [profileData]);

  // Function to render each course item in an agenda style
  const renderAgendaItem = ({ item }) => (
    <View style={styles.agendaItem}>
      <Text style={styles.courseName}>{item.name}</Text>
      {item.schedule.length > 0 ? (
        item.schedule.map((scheduleItem, index) => (
          <Text key={index} style={styles.scheduleItem}>
            {`${scheduleItem.date} à ${scheduleItem.time}`}
          </Text>
        ))
      ) : (
        <Text style={styles.scheduleItem}>No schedule available</Text>
      )}
    </View>
  );

  // Display loading while fetching profile data
  if (!profileData) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  // Sort courses by date for an agenda view
  const sortedCourses = profileData.courses.sort((a, b) => new Date(a.schedule[0].date) - new Date(b.schedule[0].date));

  return (
    <View style={styles.container}>
      {/* Calendar at the top */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={(day) => {
            console.log('Selected day', day);
          }}
          markedDates={markedDates}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            arrowColor: 'orange',
            monthTextColor: 'black',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
        />
      </View>

      {/* List of courses in agenda style */}
      <FlatList
        data={sortedCourses}
        renderItem={renderAgendaItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.agendaList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  calendarContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  agendaItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  scheduleItem: {
    fontSize: 14,
    color: "#666",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#000",
  },
  agendaList: {
    marginTop: 10,
  },
});

export default CalendarPage;
