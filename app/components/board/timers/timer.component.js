import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

const Timer = ({ hide, timer }) => {
    const translateY = useSharedValue(-40);
    const scale = useSharedValue(1);

    const animatedTextStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    useEffect(() => {
        translateY.value = withTiming(hide ? -40 : 0);
    }, [hide]);

    useEffect(() => {
        if (timer <= 5) {
            scale.value = withSequence(
                withTiming(1.4, { duration: 200 }),
                withTiming(1, { duration: 200 }),
            );
        }
    }, [timer]);

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY: translateY }] }]}>
            <Animated.Text style={[styles.paragraph, animatedTextStyle, timer <= 5 && { color: '#f00', fontWeight: "800" }]}>{timer}</Animated.Text>
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
    }
});