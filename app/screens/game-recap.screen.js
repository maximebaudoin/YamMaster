import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { formatDate } from "../utils/utils";
import Header from "../components/header/header.component";
import { Robot } from "../components/icons/robot.component";

export default function GameRecap({ route }) {
  const data = route.params?.data;

  console.log(data.gameState.playerScore);

  return (
    <SafeAreaView style={{
      backgroundColor: "#22292F", height: "100%"}}>
      <Header />
      <View style={[styles.gameItemContainer, data.gameState.playerScore > data.gameState.opponentScore
      ? { backgroundColor: "#1D4620" }
      : data.gameState.playerScore < data.gameState.opponentScore
      ? { backgroundColor: "#710C06" }
      : { backgroundColor: "#655802" }]}>

      {data.gameState.isBotGame && (
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
          <Robot width={30} height={30} fill="#FFF" />
        </View>
      )}
        {data.gameState.playerScore > data.gameState.opponentScore ? (
          <Text style={[styles.resultLabel, { color: "#4CAF50" }]}>Victoire</Text>
        ) : data.gameState.playerScore < data.gameState.opponentScore ? (
          <Text style={[styles.resultLabel, { color: "#F44336" }]}>Défaite</Text>
        ) : (
          <Text style={[styles.resultLabel, { color: "#fcdb03" }]}>Égalité</Text>
        )}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreContainerText}>
            {data.gameState.playerScore}
          </Text>
          <Text style={styles.scoreContainerText}>-</Text>
          <Text style={styles.scoreContainerText}>
            {data.gameState.opponentScore}
          </Text>
        </View>
        <Text style={styles.date}>{formatDate(data.date)}</Text>
      </View>
      <Text style={styles.titleGrid}>Grille de la partie :</Text>
      <Grid grid={data.gameState.grid} />
    </SafeAreaView>
  );
}

const Grid = ({ grid }) => {
  return (
    <View style={styles.gridContainer}>
      {grid &&
        grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, cellIndex) => (
              <View
                key={cellIndex}
                style={[
                  styles.cell,
                  cell.owner === "player:1" && styles.playerOwnedCell,
                  cell.owner === "player:2" && styles.opponentOwnedCell,
                  rowIndex !== 0 && styles.topBorder,
                  cellIndex !== 0 && styles.leftBorder,
                ]}
              >
                <Text style={[styles.cellText, cell.owner && {color: "black"}]}>{cell.viewContent}</Text>
              </View>
            ))}
          </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "600",
    margin: 20,
  },
  gameItemContainer: {
    //   flex: 1,
    display: "flex",
    color: "red",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    padding: 10,
    borderRadius: 10, // Tiny and elegant border radius
    // borderWidth: 1,
    // borderColor: "#444444", // Darker gray border for a subtle contrast
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 30,
    fontWeight: "600",
  },
  scoreContainer: {
    display: "flex",
    width: "100%",
    paddingHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreContainerText: {
    fontWeight: "600",
    fontSize: 50,
    color: "white"
  },
  date: {
    fontWeight: "300",
    fontSize: 15,
    color: "white"
  },
  titleGrid: {
    padding: 15,
    fontSize: 20,
    fontWeight: "400",
    color: "white"
  },
  gridContainer: {
    width: "100%",
    height: "50%",
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cell: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  cellText: {
    fontSize: 11,
    color: "white"
  },
  playerOwnedCell: {
    backgroundColor: "lightgreen",
    opacity: 0.9,
  },
  opponentOwnedCell: {
    backgroundColor: "lightcoral",
    opacity: 0.9,
  },
  canBeCheckedCell: {
    backgroundColor: "lightyellow",
  },
  topBorder: {
    borderTopWidth: 1,
  },
  leftBorder: {
    borderLeftWidth: 1,
  },
});
