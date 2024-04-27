import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Scores from "./scores/scores.component";
import Timers from "./timers/timers.component";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../../contexts/socket.context";

const GameInfos = () => {
    const socket = useContext(SocketContext);

    const [playerScore, setPlayerScore] = useState(0);
    const [opponentScore, setOpponentScore] = useState(0);
    const [playerTimer, setPlayerTimer] = useState(0);
    const [opponentTimer, setOpponentTimer] = useState(0);
    const [playerIsCurrentTurn, setPlayerIsCurrentTurn] = useState(false);
    const [opponentIsCurrentTurn, setOpponentIsCurrentTurn] = useState(false);

    useEffect(() => {
        socket.on("game.timer", (data) => {
            setPlayerTimer(data['playerTimer'])
            setOpponentTimer(data['opponentTimer']);
        });

        socket.on("game.scores.view-state", (data) => {
            setPlayerScore(data['playerScore']);
            setOpponentScore(data['opponentScore']);
        });

        socket.on("game.infos.view-state", (data) => {
            setPlayerIsCurrentTurn(data['playerIsCurrentTurn']);
            setOpponentIsCurrentTurn(data['opponentIsCurrentTurn']);
        });
    }, []);

    return (
        <SafeAreaView
            edges={['top']}
            style={styles.container}
        >
            <View style={styles.body}>
                <Scores
                    playerIsCurrentTurn={playerIsCurrentTurn}
                    opponentIsCurrentTurn={opponentIsCurrentTurn}
                    playerScore={playerScore}
                    opponentScore={opponentScore}
                />
                <Timers
                    playerIsCurrentTurn={playerIsCurrentTurn}
                    opponentIsCurrentTurn={opponentIsCurrentTurn}
                    playerTimer={playerTimer}
                    opponentTimer={opponentTimer}
                />
            </View>
        </SafeAreaView>
    );
}

export default GameInfos;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#CE331F',
        paddingBottom: 15,
    },
    body: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
    }
});