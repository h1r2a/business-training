import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { categories } from "../../data";

export default function ModulesPage({ route, navigation }) {
  const { categoryId } = route.params;
  const category = categories.find((cat) => cat.id === categoryId);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  // Fonction pour vérifier le solde de l'utilisateur
  const getBalance = async () => {
    const profile = await AsyncStorage.getItem("profile");
    return profile ? JSON.parse(profile).balance : 0;
  };

  // Fonction pour mettre à jour le solde de l'utilisateur
  const updateBalance = async (newBalance) => {
    const profile = await AsyncStorage.getItem("profile");
    if (profile) {
      const userProfile = JSON.parse(profile);
      userProfile.balance = newBalance;
      await AsyncStorage.setItem("profile", JSON.stringify(userProfile));
    }
  };

  // Fonction pour ajouter un module aux cours
  const addCourse = async (module) => {
    const profile = await AsyncStorage.getItem("profile");
    if (profile) {
      const userProfile = JSON.parse(profile);
      userProfile.courses = [...(userProfile.courses || []), module];
      await AsyncStorage.setItem("profile", JSON.stringify(userProfile));
    }
  };

  const handleSubscribe = (module) => {
    setSelectedModule(module);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedModule(null);
  };

  const confirmSubscription = async () => {
    const balance = await getBalance();

    // Vérifie si le solde est suffisant
    if (balance >= selectedModule.fees) {
      const newBalance = balance - selectedModule.fees;
      await updateBalance(newBalance); // Met à jour le solde
      await addCourse(selectedModule); // Ajoute le module aux cours
      Alert.alert(
        "Souscription réussie !",
        `Vous avez souscrit au module : ${selectedModule.name}.`
      );
    } else {
      Alert.alert("Fonds insuffisants", "Vous n'avez pas assez de fonds pour souscrire à ce module.");
    }

    closeModal();
  };

  const navigateToCourse = (module) => {
    if (module) {
      navigation.navigate("Course", { course: module }); // Pass the selected module data
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.categoryTitle}>{category.name}</Text>

      {category.modules.length === 0 ? (
        <Text style={styles.noModulesText}>No modules available</Text>
      ) : (
        <FlatList
          data={category.modules}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.moduleCard}>
              <Image source={item.image} style={styles.moduleImage} />
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleName}>{item.name}</Text>
                <Text style={styles.moduleDescription}>{item.description}</Text>
                <Text style={styles.modulePrice}>Price: ${item.fees}</Text>
                <TouchableOpacity
                  style={styles.subscribeButton}
                  onPress={() => handleSubscribe(item)}
                >
                  <Text style={styles.subscribeButtonText}>Subscribe</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.arrowButton}
                onPress={() => navigation.navigate('Course', { course: item })} 
                // onPress={() => navigateToCourse(item)} 
              >
                <Text style={styles.arrowText}>→</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {selectedModule && (
        <Modal transparent={true} visible={modalVisible} onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Subscribe to {selectedModule.name}
              </Text>
              <Text style={styles.modalText}>
                Price: ${selectedModule.fees}
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={confirmSubscription}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  noModulesText: {
    color: "#666",
    textAlign: "center",
  },
  moduleCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center", // Center the items vertically
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  moduleImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 20,
  },
  moduleInfo: {
    flex: 1,
    justifyContent: "center",
  },
  moduleName: {
    color: "#333",
    fontSize: 18,
    fontWeight: "600",
  },
  moduleDescription: {
    color: "#888",
    marginVertical: 4,
  },
  modulePrice: {
    color: "#4cd964",
    fontWeight: "bold",
    marginBottom: 10,
  },
  subscribeButton: {
    backgroundColor: "#333",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  subscribeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  arrowButton: {
    marginLeft: 10, // Space between module info and arrow
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f00",
  },
});
