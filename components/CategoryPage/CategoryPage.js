import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { categories } from '../../data';

export default function CategoryPage({ navigation }) {
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryContainer} // Removed dynamic background color for uniformity
      onPress={() => navigation.navigate('Modules', { categoryId: item.id })}
    >
      <Image source={item.image} style={styles.categoryImage} />
      <View style={styles.categoryContent}>
        <Text style={styles.categoryText}>{item.name}</Text>
        <Text style={styles.categoryDescription}>{item.description}</Text>
        <Text style={styles.moduleCount}>{item.modules.length} Modules Disponibles</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Modules', { categoryId: item.id })}
        >
          <Text style={styles.buttonText}>Voir les modules</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCategoryItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff', // Changed to white for a cleaner look
  },
  categoryContainer: {
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f0f0f0', // Light grey for uniformity
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, // Reduced shadow for a softer look
    shadowRadius: 8,
    elevation: 3,
  },
  categoryImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  categoryContent: {
    padding: 16,
    backgroundColor: '#fff', // White for content background
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333', // Dark text for readability
  },
  categoryDescription: {
    fontSize: 14,
    color: '#888', // Grey description text
    marginVertical: 4,
  },
  moduleCount: {
    fontSize: 14,
    color: '#000', // Black for module count
  },
  button: {
    marginTop: 12,
    backgroundColor: '#000', // Black button for contrast
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff', // White text for button
    fontWeight: 'bold',
  },
});
