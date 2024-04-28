import React, { useState, useContext, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform, UIManager, LayoutAnimation } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";
import Dice from "./dice.component";
import Roll from "./roll.component";
import Animated, { CurvedTransition, LinearTransition, SequencedTransition, Transition } from 'react-native-reanimated';

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PlayerDeck = () => {
    const socket = useContext(SocketContext);
    const [displayPlayerDeck, setDisplayPlayerDeck] = useState(false);
    const [dices, setDices] = useState(Array(5).fill(false));
    const [displayRollButton, setDisplayRollButton] = useState(false);
    const [rollsCounter, setRollsCounter] = useState(0);
    const [rollsMaximum, setRollsMaximum] = useState(3);

    useEffect(() => {
        socket.on("game.deck.view-state", (data) => {
            setDisplayPlayerDeck(data['displayPlayerDeck']);
            if (data['displayPlayerDeck']) {
                setDisplayRollButton(data['displayRollButton']);
                setRollsCounter(data['rollsCounter']);
                setRollsMaximum(data['rollsMaximum']);
                setDices(data['dices']);
            }
        });
    }, []);

    const toggleDiceLock = (index) => {
        const newDices = [...dices];
        if (newDices[index].value !== '' && displayRollButton) {
            socket.emit("game.dices.lock", newDices[index].id);
        }
    };

    const rollDices = () => {
        if (rollsCounter <= rollsMaximum) {
            socket.emit("game.dices.roll");
        }
    };

    return (
        <View style={styles.deckPlayerContainer}>

            {displayPlayerDeck && (

                <>
                    {displayRollButton && (

                        <>
                            <View style={styles.rollInfoContainer}>
                                <Text style={styles.rollInfoText}>
                                    Lancer {rollsCounter} / {rollsMaximum}
                                </Text>
                            </View>
                        </>

                    )}

                    <View style={styles.diceContainer}>
                        {dices.map((diceData, index) => (
                            <Dice
                                key={diceData.id}
                                index={index}
                                locked={diceData.locked}
                                value={diceData.value}
                                onPress={toggleDiceLock}
                                canPress={true}
                            />
                        ))}
                    </View>

                    {displayRollButton && (

                        <>
                            <Roll handlePress={rollDices} />
                        </>

                    )}
                </>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    deckPlayerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    rollInfoContainer: {
        marginBottom: 10,
    },
    rollInfoText: {
        fontSize: 14,
        fontStyle: "italic",
    },
    diceContainer: {
        flexDirection: "row",
        flexWrap: 'wrap',
        width: "70%",
        justifyContent: "center",
        columnGap: 15,
        rowGap: 5,
        marginBottom: 10,
    }
});

export default PlayerDeck;