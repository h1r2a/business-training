import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Composant pour l'inscription
const Register = ({ onRegister }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const createAccount = async () => {
    if (username && email && password) {
      const newProfile = {
        username,
        profileImage: "https://example.com/default-profile-image.jpg",
        dashboard: "Bienvenue sur votre tableau de bord",
        courses: [],
        balance: 2000,
        personalInfo: { email },
      };

      try {
        await AsyncStorage.setItem('profile', JSON.stringify(newProfile));
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
        Alert.alert("Compte créé avec succès !");
        onRegister();
      } catch (error) {
        console.error("Erreur lors de la création du compte :", error);
      }
    } else {
      Alert.alert("Veuillez remplir tous les champs.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nom d'utilisateur</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Entrez votre nom d'utilisateur"
        placeholderTextColor="#aaa"
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Entrez votre email"
        keyboardType="email-address"
        placeholderTextColor="#aaa"
      />
      <Text style={styles.label}>Mot de passe</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Entrez votre mot de passe"
        secureTextEntry
        placeholderTextColor="#aaa"
      />
      <Button title="Créer un compte" onPress={createAccount} color="#000" />
    </View>
  );
};

// Composant pour l'authentification
const Login = ({ navigation, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const authenticateUser = async () => {
    const storedEmail = await AsyncStorage.getItem('email');
    const storedPassword = await AsyncStorage.getItem('password');

    if (email === storedEmail && password === storedPassword) {
      navigation.navigate("Drawer");
      Alert.alert("Connexion réussie !");
      onLogin();
    } else {
      Alert.alert("Email ou mot de passe incorrect.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Entrez votre email"
        keyboardType="email-address"
        placeholderTextColor="#aaa"
      />
      <Text style={styles.label}>Mot de passe</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Entrez votre mot de passe"
        secureTextEntry
        placeholderTextColor="#aaa"
      />
      <Button title="Se connecter" onPress={authenticateUser} color="#000" />
    </View>
  );
};

const AccountPage = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'login', title: 'Connexion' },
    { key: 'register', title: 'Inscription' },
  ]);

  const renderScene = SceneMap({
    login: () => <Login navigation={navigation} onLogin={() => navigation.navigate("Drawer")} />,
    register: () => <Register onRegister={() => navigation.navigate("Drawer")} />,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      style={styles.tabBar}
      indicatorStyle={styles.indicator}
      labelStyle={styles.labelStyle}
    />
  );

  return (
    <View style={styles.mainContainer}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: '100%' }}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    marginTop: 50,
    backgroundColor: '#fff', // Background color
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: '#fff', // Container background color
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000', // Label color
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    color: '#000', // Input text color
  },
  tabBar: {
    backgroundColor: '#fff', // Tab bar background color
  },
  indicator: {
    backgroundColor: '#000', // Tab indicator color
  },
  labelStyle: {
    color: '#000', // Tab label color
  },
});

export default AccountPage;
