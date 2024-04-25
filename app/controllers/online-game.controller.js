import React, { useEffect, useState, useContext } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SocketContext } from '../contexts/socket.context';
import { useNavigation } from "@react-navigation/native";
import Board from "../components/board/board.component";
import ConfettiCannon from 'react-native-confetti-cannon';

export default function OnlineGameController() {

    const navigation = useNavigation();

    const socket = useContext(SocketContext);

    const [inQueue, setInQueue] = useState(false);
    const [inGame, setInGame] = useState(false);
    const [inEndGame, setInEndGame] = useState(false);
    const [win, setWin] = useState(null);
    const [loose, setLoose] = useState(null);
    const [endScore, setEndScore] = useState(null);
    const [idOpponent, setIdOpponent] = useState(null);

    const leaveQueue = () => {
        socket.emit("queue.leave");
    }

    useEffect(() => {
        socket.emit("queue.join");
        setInQueue(false);
        setInGame(false);
        setInEndGame(false);

        socket.on('queue.added', (data) => {
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
            setInEndGame(data['inEndGame']);
        });

        socket.on('queue.removed', data => {
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
            setInEndGame(data['inEndGame']);
            navigation.navigate('HomeScreen');
        })

        socket.on('game.start', (data) => {
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
            setInEndGame(data['inEndGame']);
            setIdOpponent(data['idOpponent']);
        });

        socket.on('game.end', (data) => {
            setInQueue(data['inQueue']);
            setInGame(data['inGame']);
            setInEndGame(data['inEndGame']);
            setWin(data['win']);
            setLoose(data['loose']);
            setEndScore(data['endScore']);
        });

        return leaveQueue;
    }, []);

    return (
        <View style={styles.container}>
            {!inQueue && !inGame && (
                <>
                    <Text style={styles.paragraph}>
                        Waiting for server datas...
                    </Text>
                </>
            )}

            {inQueue && (
                <>
                    <Text style={styles.paragraph}>
                        Waiting for another player...
                    </Text>
                    <Button
                        title="Quitter la file d'attente"
                        onPress={leaveQueue}
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
                    {win && <Text>Bravo !</Text>}
                    <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
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
    }
});