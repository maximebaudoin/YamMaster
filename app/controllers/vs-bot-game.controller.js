import React, { useEffect, useState, useContext } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SocketContext } from '../contexts/socket.context';
import { useNavigation } from "@react-navigation/native";
import Board from "../components/board/board.component";
import ConfettiCannon from 'react-native-confetti-cannon';
import { FlagCheckered } from "../components/icons/flag-checkered.component";

export default function VsBotGameController() {

    const navigation = useNavigation();

    const socket = useContext(SocketContext);

    const [inLoadingGame, setInLoadingGame] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [inEndGame, setInEndGame] = useState(false);
    const [win, setWin] = useState(null);
    const [loose, setLoose] = useState(null);
    const [endScore, setEndScore] = useState(null);

    const startNewGame = () => {
        socket.emit("game.vsbot.start");
        setInLoadingGame(true);
        setInGame(false);
        setInEndGame(false);
    }

    useEffect(() => {
        startNewGame();

        socket.on('game.start', (data) => {
            setInLoadingGame(data['inLoadingGame']);
            setInGame(data['inGame']);
            setInEndGame(data['inEndGame']);
        });

        socket.on('game.end', (data) => {
            setInGame(data['inGame']);
            setInEndGame(data['inEndGame']);
            setWin(data['win']);
            setLoose(data['loose']);
            setEndScore(data['endScore']);
        });
    }, []);

    return (
        <View style={styles.container}>
            {!inLoadingGame && !inGame && !inEndGame && (
                <>
                    <Text style={styles.paragraph}>
                        Waiting for server datas...
                    </Text>
                </>
            )}

            {inLoadingGame && (
                <>
                    <Text style={styles.paragraph}>
                        Lancement de la partie...
                    </Text>
                </>
            )}

            {inGame && !inEndGame && (
                <>
                    <Board />
                </>
            )}

            {inGame && inEndGame && (
                <>
                    <FlagCheckered width={120} height={120} fill="#fff" style={styles.endGameFlag} />
                    <Text style={styles.endGameTitle}>Partie terminée</Text>
                    {win ? (
                        <>
                            <Text>Bravo !</Text>
                            <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
                        </>
                    ) : (
                        <>
                            <Text>Le joueur adverse a gagné...</Text>
                            <TouchableOpacity
                                onPress={startNewGame}
                                style={styles.endGameRestart}
                            >
                                <Text>Rejouer</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        height: '100%'
    },
    paragraph: {
        fontSize: 16,
        color: '#fff'
    },
    endGameFlag: {
        transform: [{
            rotate: '15deg'
        }]
    },
    endGameTitle: {
        fontSize: 30,
        color: '#fff',
        fontWeight: '700'
    }
});