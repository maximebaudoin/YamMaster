import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import PlayerTimer from "./timers/player-timer.component";
import OpponentTimer from "./timers/opponent-timer.component";
import OpponentDeck from "./decks/opponent-deck.component";
import PlayerDeck from "./decks/player-deck.component";
import Choices from "./choices/choices.component";
import Grid from "./grid/grid.component";

const OpponentInfos = () => {
    return (
        <View style={styles.opponentInfosContainer}>
            <Text style={styles.paragraph}>Opponent infos</Text>
        </View>
    );
};

const OpponentScore = () => {
    return (
        <View style={styles.opponentScoreContainer}>
            <Text style={styles.paragraph}>Score: </Text>
        </View>
    );
};

const PlayerInfos = () => {
    return (
        <View style={styles.playerInfosContainer}>
            <Text style={styles.paragraph}>Player Infos</Text>
        </View>
    );
};

const PlayerScore = () => {

    return (
        <View style={styles.playerScoreContainer}>
            <Text style={styles.paragraph}>PlayerScore</Text>
        </View>
    );
};

const Board = ({ gameViewState }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.row, { height: '5%' }]}>
                <OpponentInfos />
                <View style={styles.opponentTimerScoreContainer}>
                    <OpponentTimer />
                    <OpponentScore />
                </View>
            </View>
            <View style={[styles.row, { height: '25%' }]}>
                <OpponentDeck />
            </View>
            <View style={[styles.row, { height: '40%' }]}>
                <Grid />
                <Choices />
            </View>
            <View style={[styles.row, { height: '25%' }]}>
                <PlayerDeck />
            </View>
            <View style={[styles.row, { height: '5%' }]}>
                <PlayerInfos />
                <View style={styles.playerTimerScoreContainer}>
                    <PlayerTimer />
                    <PlayerScore />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    row: {
        flexDirection: 'row',
        width: '100%'
    },
    opponentInfosContainer: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    opponentTimerScoreContainer: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    opponentTimerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    opponentScoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deckOpponentContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    gridContainer: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)'
    },
    choicesContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    deckPlayerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    playerInfosContainer: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    playerTimerScoreContainer: {
        flex: 3,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    playerScoreContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    paragraph: {
        color: 'white'
    }
});

export default Board;