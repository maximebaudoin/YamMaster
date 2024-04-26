import React from "react";
import { View, Text, StyleSheet } from 'react-native';
import PlayerTimer from "./timers/player-timer.component";
import OpponentDeck from "./decks/opponent-deck.component";
import PlayerDeck from "./decks/player-deck.component";
import Choices from "./choices/choices.component";
import Grid from "./grid/grid.component";
import PlayerScore from "./scores/player-score.component";
import { SafeAreaView } from 'react-native-safe-area-context';
import Scores from "./scores/scores.component";

const Board = ({ gameViewState }) => {
    return (
        <View style={styles.container}>
            <SafeAreaView
                edges={['top']}
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#CE331F',
                    paddingBottom: 15,
                }}
            >
                <Scores />
            </SafeAreaView>
            <View style={[styles.row, { flex: 1 }]}>
                <OpponentDeck />
            </View>
            <View style={[styles.row, { flex: 1 }]}>
                <Grid />
                <Choices />
            </View>
            <View style={[styles.row, { flex: 1 }]}>
                <PlayerDeck />
            </View>
            <View style={[styles.row, { flex: 1 }]}>
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
        alignItems: 'stretch',
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