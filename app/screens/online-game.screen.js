import React, { useContext } from "react";
import { StyleSheet, View, Button, Text, SafeAreaView } from "react-native";
import { SocketContext } from '../contexts/socket.context';
import OnlineGameController from "../controllers/online-game.controller";
import { LinearGradient } from 'expo-linear-gradient';

export default function OnlineGameScreen({ navigation }) {
    const socket = useContext(SocketContext);
    
    return (
        <LinearGradient
            style={styles.container}
            colors={['#1D74D0', '#002972']}
        >
            <SafeAreaView >
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
                    <OnlineGameController />
                )}
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "lightgrey",
        alignItems: "center",
        justifyContent: "center",
    }
});