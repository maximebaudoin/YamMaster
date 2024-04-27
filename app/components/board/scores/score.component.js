import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";

const Score = ({ score }) => {
    return (
        <Text style={styles.paragraph}>{score}</Text>
    );
};

export default Score;

const styles = StyleSheet.create({
    paragraph: {
        color: 'white',
        fontSize: 35,
        marginTop: -3,
        marginBottom: -5,
        fontWeight: "700",
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 3
    }
});