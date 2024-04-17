import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";

const OpponentTimer = () => {
    const socket = useContext(SocketContext);
    const [opponentTimer, setOpponentTimer] = useState(0);

    useEffect(() => {
        socket.on("game.timer", (data) => {
            setOpponentTimer(data['opponentTimer'])
        });
    }, []);
    return (
        <View style={styles.opponentTimerContainer}>
            <Text style={styles.paragraph}>Timer: {opponentTimer}</Text>
        </View>
    );
};

export default OpponentTimer;

const styles = StyleSheet.create({
    playerTimerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    paragraph: {
        color: 'white'
    }
});