// src/HomePage.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { categories } from '../../data'; // Assuming you have the categories data imported

const getRandomModules = () => {
  // Create an array of all modules from the categories
  const allModules = categories.flatMap(category => category.modules);
  
  // Shuffle the array and take the first 4 modules (or adjust the number as needed)
  return allModules.sort(() => 0.5 - Math.random()).slice(0, 4);
};

export default function HomePage({ navigation }) {
  const [randomModules, setRandomModules] = useState([]);

  useEffect(() => {
    const modules = getRandomModules();
    setRandomModules(modules);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Boostez votre carriere grace a nos formations de qualité!</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={require('../../assets/presentation.webp')} style={styles.image} />
      </View>
      <Text style={styles.exploreText}>Explorer les cours</Text>
      
      <FlatList
        data={randomModules}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('Course', { course: item })} 
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>Frais: ${item.fees}</Text>
          </TouchableOpacity>
        )}
        numColumns={2} // Display cards in two columns
        columnWrapperStyle={styles.cardContainer}
      />

      <TouchableOpacity style={styles.viewCoursesButton} onPress={() => navigation.navigate('Categories')}>
        <Text style={styles.buttonText}>Explorer les categories</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 12,
  },
  exploreText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  cardContainer: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 20,
    width: '45%', // Keep it square
    height: 150, // Adjust height for square shape
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: '#ccc',
    marginTop: 6,
  },
  viewCoursesButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
