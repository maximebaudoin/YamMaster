import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";

const PlayerScore = ({ score }) => {
    return (
        <Text style={styles.paragraph}>{score}</Text>
    );
};

export default PlayerScore;

const styles = StyleSheet.create({
    paragraph: {
        color: 'white',
        marginTop: -3,
        marginBottom: -5,
        fontSize: 35,
        fontWeight: "700",
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 3
    }
});