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
  Animated,
  Easing,
  Image,
} from "react-native";
import User from "../services/api/user.service";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faDiceThree } from "@fortawesome/free-solid-svg-icons";
import { validatePassword } from "../utils/utils";
import { handleSuccessfulLogin } from "../services/authService";

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigation = useNavigation();
  const rotation = useRef(new Animated.Value(0)).current;

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
    setIsValidPassword(true)
    if (validatePassword(password)) {
      try {
        setIsProcessing(true);
        const response = await User.SignUp(username, password);
        if (response.status == "201" && response.data._id) {
          await handleSuccessfulLogin(response.data.username);
          navigation.navigate("HomeScreen");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setIsValidPassword(false)
    }
    setIsProcessing(false);
  };

  useEffect(() => {
    setIsProcessing(false);
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
          <Text style={styles.title}>Créer un compte</Text>
          <View style={styles.inputContainer}>
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
              marginBottom: 10,
              opacity: !isValidPassword ? 1 : 0,
              textAlign: "center"
            }}
          >
            Le mot de passe ne doit contenir que des minuscules, majuscules, chiffres et caractères spéciaux.
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            {isProcessing ? (
              <Animated.View
                style={{ transform: [{ rotate: rotationInterpolate }] }}
              >
                <FontAwesomeIcon icon={faDiceThree} size={25} color="#fff" />
              </Animated.View>
            ) : (
              <Text style={styles.buttonText}>S'inscrire</Text>
            )}
          </TouchableOpacity>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#22292F", // Dark background like LoginScreen
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
  inputContainer: {
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
    borderRadius: 30, // Rounded edges to match LoginScreen
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
