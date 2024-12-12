import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Button, Alert, FlatList } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePage = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);

  const fetchProfileData = async () => {
    const data = await AsyncStorage.getItem('profile');
    setProfileData(JSON.parse(data));
  };

  useEffect(() => {
    fetchProfileData();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProfileData();
    });

    return unsubscribe;
  }, [navigation]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('password');
      await AsyncStorage.removeItem('profile');
      Alert.alert("Déconnexion réussie !");
      navigation.navigate("Account");
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error);
    }
  };

  if (!profileData) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  // Met à jour pour afficher le calendrier au lieu des frais
  const renderCourseItem = ({ item }) => (
    <View style={styles.courseCard}>
      <Text style={styles.courseName}>{item.name}</Text>
      <Text style={styles.scheduleTitle}>Calendrier:</Text>
      {item.schedule.length > 0 ? (
        item.schedule.map((scheduleItem, index) => (
          <Text key={index} style={styles.scheduleItem}>
            {`${scheduleItem.date} à ${scheduleItem.time}`}
          </Text>
        ))
      ) : (
        <Text style={styles.scheduleItem}>Pas de calendrier disponible</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/presentation.webp')}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{profileData.username}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cours Inscrits</Text>
        {profileData.courses && profileData.courses.length > 0 ? (
          <FlatList
            data={profileData.courses}
            renderItem={renderCourseItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={styles.courseList}
          />
        ) : (
          <Text style={styles.cardContent}>Aucun cours inscrit.</Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Solde</Text>
        <Text style={styles.cardContent}>{profileData.balance}€</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Email:</Text>
        <Text style={styles.cardContent}>{profileData.personalInfo.email}</Text>
      </View>

      <Button title="Se déconnecter" onPress={logout} color="#333" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
  },
  card: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
    color: "#000",
  },
  cardContent: {
    fontSize: 16,
    color: "#333",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#000",
  },
  courseList: {
    marginTop: 10,
  },
  courseCard: {
    backgroundColor: "#000",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    width: 120,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courseName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  scheduleTitle: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
  scheduleItem: {
    color: "#ccc",
    fontSize: 12,
  },
});

export default ProfilePage;
