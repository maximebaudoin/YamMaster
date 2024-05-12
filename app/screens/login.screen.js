import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Image,
  Animated,
  Easing,
} from "react-native";
import User from "../services/api/user.service";
import { Link, useNavigation } from "@react-navigation/native";
import { handleSuccessfulLogin } from "../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../components/button.component";
import { Robot } from "../components/icons/robot.component";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faDiceThree } from "@fortawesome/free-solid-svg-icons";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [areWrongCredentials, setAreWrongCredentials] = useState(false);
  const [isWaitingServerResponse, setIsWaitingServerResponse] = useState("");
  const navigation = useNavigation();

  const rotation = useRef(new Animated.Value(0)).current; // Using useRef to persist the value across renders

  const startRotation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      })
    ).start();
  };

  const rotationInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleSubmit = async () => {
    try {
      setIsWaitingServerResponse(true);
      setAreWrongCredentials(false)
      const response = await User.Login(username, password);
      if (response.status == "200" && response.data._id) {
        await handleSuccessfulLogin(response.data.username);
        navigation.navigate("HomeScreen");
      } else {
        setAreWrongCredentials(true)
      }
    } catch (error) {
      console.log(error);
    }
    setIsWaitingServerResponse(false);
  };

  useEffect(() => {
    setIsWaitingServerResponse(false);
    startRotation();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.content}>
          <Image
            style={styles.logo}
            source={require("../../assets/logo.png")}
          />
          <Text style={styles.title}>Connexion</Text>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Nom d'utilisateur"
              placeholderTextColor="#B4B4B4"
              onChangeText={(value) => setUsername(value)}
              value={username}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholder="Mot de passe"
              placeholderTextColor="#B4B4B4"
              onChangeText={(value) => setPassword(value)}
              value={password}
              autoCapitalize="none"
            />
          </View>

          <Text
            style={{
              color: "#f53b3b",
              fontWeight: "bold",
              fontSize: 13,
              marginTop: 10,
              marginBottom: 10,
              opacity: `${areWrongCredentials ? 1 : 0}`
            }}
          >
            Ces informations de connexion sont incorrectes.
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            {isWaitingServerResponse ? (
              <Animated.View
                style={{ transform: [{ rotate: rotationInterpolate }] }}
              >
                <FontAwesomeIcon icon={faDiceThree} size={25} color="#fff" />
              </Animated.View>
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>
          <Text style={{ color: "white" }}>
            Vous n'avez pas de compte ?{" "}
            <Text
              style={{ fontWeight: "bold" }}
              onPress={() => navigation.navigate("SignupScreen")}
            >
              Créez-en un
            </Text>
            .
          </Text>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#22292F", // Dark background like HomeScreen
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
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
  input: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: "#fff", // Maintaining white input fields for better visibility
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007bff",
    width: 300,
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 30, // Rounded edges to match buttons on HomeScreen
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
