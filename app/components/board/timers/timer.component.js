import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

const Timer = ({ hide, timer }) => {
    const translateY = useSharedValue(-40);

    useEffect(() => {
        translateY.value = withTiming(hide ? -40 : 0);
    }, [hide]);

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY: translateY }] }]}>
            <Text style={styles.paragraph}>{timer}</Text>
        </Animated.View>
    );
};

export default Timer;

const styles = StyleSheet.create({
    container: {
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingVertical: 6,
        borderBottomLeftRadius: 7,
        borderBottomRightRadius: 7,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    paragraph: {
        color: '#fff',
        fontSize: 20,
        fontWeight: "600",
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 3
    }
});