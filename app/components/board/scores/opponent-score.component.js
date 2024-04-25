import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";

const OpponentScore = () => {
    const socket = useContext(SocketContext);
    const [opponentScore, setOpponentScore] = useState(0);

    useEffect(() => {
        socket.on("game.scores.view-state", (data) => {
            setOpponentScore(data['opponentScore'])
        });
    }, []);

    return (
        <View style={styles.opponentScoreContainer}>
            <Text style={styles.paragraph}>Score: {opponentScore}</Text>
        </View>
    );
};

export default OpponentScore;

const styles = StyleSheet.create({
    opponentScoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    paragraph: {
        color: 'white'
    }
});