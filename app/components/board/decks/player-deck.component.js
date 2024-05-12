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
                                    Lancé {rollsCounter} / {rollsMaximum}
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
        alignItems: "center",
        position: "relative",
        gap: 20
    },
    rollInfoContainer: {
        alignSelf: "flex-end",
        backgroundColor: '#CE331F',
        borderTopLeftRadius: 99,
        borderBottomLeftRadius: 99,
        paddingHorizontal: 10,
        paddingVertical: 7,
        paddingLeft: 13
    },
    rollInfoText: {
        fontSize: 15,
        fontStyle: "italic",
        fontWeight: "600",
        color: "#fff"
    },
    diceContainer: {
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: "center",
        columnGap: 15,
        rowGap: 12,
    }
});

export default PlayerDeck;