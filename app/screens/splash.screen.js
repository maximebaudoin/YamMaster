import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Animated, Easing, Image, SafeAreaView, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    // Fonction asynchrone pour vérifier l'état de connexion
    const checkLoggedInStatus = async () => {
      try {
        // Récupère le nom d'utilisateur depuis AsyncStorage
        const username = await AsyncStorage.getItem("username");
        // Met à jour l'état de connexion en fonction de la présence du nom d'utilisateur
        setIsLoggedIn(!!username);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du nom d'utilisateur :",
          error
        );
      }
    };

    // Appelle la fonction pour vérifier l'état de connexion
    checkLoggedInStatus();
  }, []);

  useEffect(() => {
    // Temporisation pour naviguer vers la page suivante après 2 secondes
    const timeout = setTimeout(() => {
      // Navigue vers la page suivante si l'utilisateur est connecté
      if (isLoggedIn) {
        navigation.navigate("HomeScreen");

        // navigation.navigate("LoginScreen");
      } else {
        // Navigue vers une autre page si l'utilisateur n'est pas connecté après 2 secondes
        navigation.navigate("LoginScreen");
      }
    }, 2000);

    // Nettoie le timeout si le composant est démonté avant la fin du délai
    return () => clearTimeout(timeout);
  }, [isLoggedIn, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        source={require("../../assets/logo.png")}
      />
      <Text style={styles.title}>
        Yam Master
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#22292F", // Adding a dark theme
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 30,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff", // White text color for better contrast
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    color: "#FFFFFF", // White for visibility
  },
});
