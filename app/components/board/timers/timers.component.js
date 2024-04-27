import { StyleSheet, Text, View } from "react-native";
import Timer from "./timer.component";

const Timers = ({ playerIsCurrentTurn, opponentIsCurrentTurn, playerTimer, opponentTimer }) => {
    return (
        <View style={styles.container}>
            <Timer hide={!playerIsCurrentTurn} timer={playerTimer} />
            <Timer hide={!opponentIsCurrentTurn} timer={opponentTimer} />
        </View>
    );
};

export default Timers;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0, right: 0,
        top: '100%',
        justifyContent: 'center',
        gap: 40,
        flexDirection: 'row',
        overflow: 'hidden'
    }
});