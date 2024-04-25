import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";

const PlayerScore = () => {
    const socket = useContext(SocketContext);
    const [playerScore, setPlayerScore] = useState(0);

    useEffect(() => {
        socket.on("game.scores.view-state", (data) => {
            setPlayerScore(data['playerScore'])
        });
    }, []);

    return (
        <View style={styles.playerScoreContainer}>
            <Text style={styles.paragraph}>Score: {playerScore}</Text>
        </View>
    );
};

export default PlayerScore;

const styles = StyleSheet.create({
    playerScoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    paragraph: {
        color: 'white'
    }
});