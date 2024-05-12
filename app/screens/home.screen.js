import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import Button from "../components/button.component";
import LottieView from "lottie-react-native";
import { EarthEurope } from "../components/icons/earth-europe.component";
import { Robot } from "../components/icons/robot.component";
import { RotateRight } from "../components/icons/rotate-right.component";
import { ArrowLeftFromBracket } from "../components/icons/arrow-left-from-bracket.component";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { logout } from "../services/authService";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TrophyIcon } from "../components/icons/trophy-icon.component";

export default function HomeScreen({ navigation }) {
  const [usernamePlayer, setUsernamePlayer] = useState("");

  useEffect(() => {
    async function fetchUsername() {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername !== null) {
          setUsernamePlayer(storedUsername);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du nom d'utilisateur :",
          error
        );
      }
    }
    fetchUsername();
  }, []);

  const handleLogout = async () => {
    await logout(); // Appel de la fonction logout du service d'authentification

    // Navigation vers l'écran de connexion tout en vidant la stack de navigation
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: "LoginScreen" }, // Remplace la stack de navigation par LoginScreen
        ],
      })
      
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.body}>
              <TouchableOpacity style={styles.logout} onPress={handleLogout}>
                <ArrowLeftFromBracket
                  width={20}
                  height={20}
                  fill="rgba(255,255,255,0.7)"
                />
                <Text style={{ color: "white", fontSize: 15, fontWeight: "600" }}>
                  Me déconnecter
                </Text>
              </TouchableOpacity>
              <Text style={{
                color: "white",
                fontSize: 25,
                fontWeight: "bold",
                marginBottom: 30
              }}>Bonjour {usernamePlayer} !</Text>
              <Image
                  style={{
                      width: 200,
                      height: 200,
                      objectFit: 'contain',
                      borderRadius: 30
                  }}
                  source={require('../../assets/logo.png')}
                />
                <View style={{
                    gap: 10,
                    marginVertical: 40,
                    alignItems: 'center'
                }}>
                    <View>
                      <Button
                        handlePress={() => navigation.navigate("OnlineGameScreen")}
                        theme="primary"
                        leftIcon={EarthEurope}
                      >
                        Jouer en ligne
                      </Button>
                    </View>
                    <View>
                      <Button
                        handlePress={() => navigation.navigate("VsBotGameScreen")}
                        theme="danger"
                        leftIcon={Robot}
                      >
                        Jouer contre le bot
                      </Button>
                    </View>
                    <View>
                      <Button
                        handlePress={() => navigation.navigate("GamesScreen")}
                        theme="other"
                        leftIcon={TrophyIcon}
                      >
                        Voir mes parties
                      </Button>
                    </View>
                </View>
                <LottieView
                    autoPlay
                    style={{
                        width: 200,
                        height: 200,
                    }}
                    source={require('../../assets/lottie/dice.json')}
                />
            </View>
            <Text style={styles.copyright}>© Antonin SIMON et Maxime BAUDOIN</Text>
            <Text style={styles.copyright}>EPSI Bordeaux – I1 DEV2</Text>
        </SafeAreaView>
    );
  };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#22292F",
        alignItems: "center",
        justifyContent: "center",
    },
    body: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    copyright: {
        color: 'rgba(255,255,255,0.2)'
    },
    logout: {
      width: "50%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      backgroundColor: "#736464",
      padding: 10,
      borderRadius: 9,
      position: "absolute",
      top: 70, // Positions the top edge of the element at the top of its nearest positioned ancestor
      left: 20, // Positions the left edge of the element at the left of its nearest positioned ancestor
    },
});
