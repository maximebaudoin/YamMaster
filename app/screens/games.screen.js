import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import Game from "../services/api/game.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { formatDate } from "../utils/utils";
import Header from "../components/header/header.component";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faDiceThree } from "@fortawesome/free-solid-svg-icons";
import { Robot } from "../components/icons/robot.component";

export default function GamesScreen() {
  const [listGames, setListGames] = useState([]);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      setUsername(storedUsername || "");
      fetchGames(storedUsername);
    };
    fetchUsername();
    startRotation();
  }, []);

  const fetchGames = async (username) => {
    setIsLoading(true);
    try {
      const response = await Game.getAllByUsername(username);
      if (response.status == "200") {
        const sortedGames = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setListGames(sortedGames);
      }
    } catch (error) {
      console.error("Error fetching games:", error);
    }
    setIsLoading(false);
  };

  const renderGameItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.gameItemContainer,
        item.gameState.playerScore > item.gameState.opponentScore
          ? { backgroundColor: "#1D4620" }
          : item.gameState.playerScore < item.gameState.opponentScore
          ? { backgroundColor: "#710C06" }
          : { backgroundColor: "#655802" },
      ]}
      onPress={() => navigation.navigate("GameRecap", { data: item })}
    >
      {item.gameState.isBotGame && (
        <View
          style={{
            position: "absolute",
            right: 0,
            top: -10,
            padding: 7,
            backgroundColor: "#1D74D0",
            borderRadius: 9,
          }}
        >
          <Robot width={15} height={15} fill="#FFF" />
        </View>
      )}
      <Text
        style={[
          styles.resultLabel,
          item.gameState.playerScore > item.gameState.opponentScore
            ? { color: "#4CAF50" }
            : item.gameState.playerScore < item.gameState.opponentScore
            ? { color: "#F44336" }
            : { color: "#fcdb03" },
        ]}
      >
        {item.gameState.playerScore > item.gameState.opponentScore
          ? "Victoire"
          : item.gameState.playerScore < item.gameState.opponentScore
          ? "Défaite"
          : "Égalité"}
      </Text>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreContainerText}>
          {item.gameState.playerScore}
        </Text>
        <Text style={styles.scoreContainerText}>-</Text>
        <Text style={styles.scoreContainerText}>
          {item.gameState.opponentScore}
        </Text>
      </View>
      <Text style={styles.date}>{formatDate(item.date)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <Text style={styles.title}>Liste de vos parties :</Text>
      {isLoading ? (
        // Affichage de l'animation de chargement si isLoading est vrai
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Animated.View
            style={{ transform: [{ rotate: rotationInterpolate }] }}
          >
            <FontAwesomeIcon icon={faDiceThree} size={65} color="#fff" />
          </Animated.View>
        </View>
      ) : // Si isLoading est faux, vérifie la longueur de la liste des jeux
      listGames.length === 0 ? (
        // Si la liste des jeux est vide, affiche un message
        <View style={styles.emptyListGames}>
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: 20,
              fontWeight: "400",
            }}
          >
            Vous n'avez joué aucune partie, qu'attendez-vous pour faire chauffer
            les dés ?
          </Text>
          <FontAwesomeIcon icon={faDiceThree} size={25} color="#fff" />
        </View>
      ) : (
        // Si la liste des jeux n'est pas vide, affiche la FlatList
        <FlatList
          data={listGames}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.date.toString()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#22292F",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 20,
    color: "white",
  },
  gameItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "#FFFFFF",
    marginHorizontal: 10,
    marginTop: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 2,
  },
  scoreContainerText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  date: {
    fontWeight: "400",
    fontSize: 14,
    flex: 1,
    textAlign: "right",
    color: "white",
  },
  emptyListGames: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
    paddingHorizontal: 25,
  },
});
