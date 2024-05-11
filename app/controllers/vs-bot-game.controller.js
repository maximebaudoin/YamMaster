import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SocketContext } from '../contexts/socket.context';
import { useNavigation } from "@react-navigation/native";
import Board from "../components/board/board.component";
import ConfettiCannon from 'react-native-confetti-cannon';
import Button from "../components/button.component";
import { RotateRight } from "../components/icons/rotate-right.component";
import LottieView from 'lottie-react-native';

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
                    <LottieView
                        autoPlay
                        style={{
                            width: 200,
                            height: 200,
                        }}
                        source={require('../../assets/lottie/dice.json')}
                    />
                </>
            )}

            {inGame && !inEndGame && (
                <>
                    <Board />
                </>
            )}

            {inGame && inEndGame && (
                <>
                    {/* <FlagCheckered width={120} height={120} fill="#fff" style={styles.endGameFlag} /> */}
                    <LottieView
                        autoPlay
                        // ref={animation}
                        style={{
                            width: 300,
                            height: 300,
                            // backgroundColor: '#eee',
                        }}
                        source={require('../../assets/lottie/flag.json')}
                    />
                    <Text style={styles.endGameTitle}>Partie terminée</Text>
                    {win ? (
                        <>
                            <Text style={styles.endGameSubTitle}>Vous avez gagné !</Text>
                            <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
                        </>
                    ) : (
                        <>
                            <Text style={styles.endGameSubTitle}>Le bot a gagné</Text>
                        </>
                    )}
                    <View style={styles.endGameBtnContainer}>
                        <Button
                            handlePress={startNewGame}
                            leftIcon={RotateRight}
                            theme="primary"
                        >Rejouer</Button>
                        <Button
                            handlePress={() => navigation.navigate('HomeScreen')}
                        >Quitter</Button>
                    </View>
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
    endGameTitle: {
        fontSize: 30,
        color: '#fff',
        fontWeight: '700'
    },
    endGameSubTitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: '500',
        marginBottom: 20
    },
    endGameBtnContainer: {
        gap: 10
    }
});