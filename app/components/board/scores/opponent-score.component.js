import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
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
        <Text style={styles.paragraph}>{opponentScore}</Text>
    );
};

export default OpponentScore;

const styles = StyleSheet.create({
    paragraph: {
        color: 'white',
        fontSize: 35,
        fontWeight: "700",
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 3
    }
});