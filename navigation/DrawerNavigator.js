import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomePage from "../components/HomePage/HomePage";
import CategoryPage from "../components/CategoryPage/CategoryPage";
import ModulesPage from "../components/ModulesPage/ModulesPage";
import ProfilePage from "../components/ProfilePage/ProfilePage";
import CalendarPage from "../components/CalendarPage/CalendarPage";
import CoursePage from "../components/CoursePage/CoursePage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AccountPage from "../components/AccountPage/AccountPage";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const checkAuthStatus = async () => {
    const storedEmail = await AsyncStorage.getItem("email");
    const storedPassword = await AsyncStorage.getItem("password");
    setIsAuthenticated(!!(storedEmail && storedPassword));
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Vérification en cours...</Text>
      </View>
    );
  }

  return (
    <Drawer.Navigator initialRouteName={isAuthenticated ? "Home" : "Account"}>
      {isAuthenticated ? (
        <>
          <Drawer.Screen
            name="Home"
            component={HomePage}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="home" color={color} size={size} />
              ),
            }}
          />
          <Drawer.Screen
            name="Profile"
            component={ProfilePage}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="person" color={color} size={size} />
              ),
            }}
          />
          <Drawer.Screen
            name="Categories"
            component={CategoryPage}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="list" color={color} size={size} />
              ),
            }}
          />
          <Drawer.Screen
            name="Modules"
            component={ModulesPage}
            options={{
              drawerIcon: () => null,
              drawerItemStyle: { display: "none" }, // Cachez ce Drawer si nécessaire
            }}
          />
                    <Drawer.Screen
            name="Course"
            component={CoursePage}
            options={{
              drawerIcon: () => null,
              drawerItemStyle: { display: "none" }, // Cachez ce Drawer si nécessaire
            }}
          />

          <Drawer.Screen
            name="Calendrier"
            component={CalendarPage}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="calendar" color={color} size={size} />
              ),
            }}
          />
        </>
      ) : (
        <Drawer.Screen
          name="Account"
          component={AccountPage}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="create" color={color} size={size} />
            ),
            headerShown: false,
          }}
        />
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
