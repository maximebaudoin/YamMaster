import React, { useContext } from "react";
import { StyleSheet, View, Button, Text, SafeAreaView } from "react-native";
import { SocketContext } from '../contexts/socket.context';
import OnlineGameController from "../controllers/online-game.controller";
import { LinearGradient } from 'expo-linear-gradient';
import VsBotGameController from "../controllers/vs-bot-game.controller";

export default function VsBotGameScreen({ navigation }) {
    const socket = useContext(SocketContext);

    return (
        <LinearGradient
            style={styles.container}
            colors={['#1D74D0', '#002972']}
        >
            {!socket && (
                <>
                    <Text style={styles.paragraph}>
                        No connection with server...
                    </Text>
                    <Text style={styles.footnote}>
                        Restart the app and wait for the server to be back again.
                    </Text>
                </>
            )}
            {socket && (
                <VsBotGameController />
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
    }
});