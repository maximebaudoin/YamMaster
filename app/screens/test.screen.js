import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import Animated, { useSharedValue, withTiming, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome6 } from '@expo/vector-icons';

export default function TestScreen() {
    const animation = useSharedValue(0);

    const inner = useAnimatedStyle(() => ({
        top: interpolate(animation.value, [0, 1], [2, 5], Extrapolation.CLAMP)
    }));

    const handlePress = () => {
        Haptics.selectionAsync();
        animation.value = withTiming(1, {
            duration: 100
        });
        // shuffle();
    };
    const handlePressUp = () => {
        Haptics.selectionAsync();
        animation.value = withTiming(0, {
            duration: 50
        });
    };

    const shuffle = () => {
        const interval = setInterval(() => {
            Haptics.selectionAsync();
        }, 200);

        setTimeout(() => {
            clearInterval(interval);
        }, 1000);
    }

    return (
        <LinearGradient
            colors={['rgb(0,128,255)', 'rgb(0,150,255)']}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPressIn={handlePress} onPressOut={handlePressUp}>
                <View style={styles.button}>
                    <View style={[styles.shadow]}></View>
                    <LinearGradient
                        style={styles.outer}
                        colors={['rgb(60,60,60)', 'rgb(40,40,40)']}
                    />
                    <Animated.View style={[styles.inner, inner]}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['rgb(255,128,0)', 'rgb(255,150,0)']}
                            style={{
                                flex: 1,
                                borderRadius: 99,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <FontAwesome6 name="dice" size={35} color="white" />
                        </LinearGradient>
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    button: {
        height: 80,
        width: 140
    },
    outer: {
        backgroundColor: "rgba(0,0,0,0.65)",
        borderRadius: 99,
        alignSelf: 'stretch',
        flex: 1
    },
    shadow: {
        backgroundColor: '#ff990050',
        width: 140 - 16,
        height: 80 - 16,
        borderRadius: 99,
        position: 'absolute',
        top: 8,
        left: 8,
        zIndex: 98
    },
    inner: {
        height: 80 - 16,
        width: 140 - 16,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 99,
        alignItems: 'stretch',
        position: 'absolute',
        top: 4,
        left: 8,
        zIndex: 99
    },
    white: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 20,
    },
});