import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Animated, { Easing, ReduceMotion, interpolateColor, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { Lock } from "../../icons/lock.component";

const width = Dimensions.get('window').width;

const Dice = ({ index, locked, value, onPress, opponent = false, canPress }) => {
    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
    const rotationDefaultValue = Math.floor(Math.random() * 14 - 7);
    const rotation = useSharedValue(rotationDefaultValue);
    const borderWidth = useSharedValue(0);
    const scale = useSharedValue(1);
    const textColor = useSharedValue(0);

    const diceWidth = ((width - 80 - 15 * 4) / 5);

    const handlePress = () => {
        if (!opponent) {
            onPress(index);
        }
    };

    const animatedContainerStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));
    const animatedBodyStyle = useAnimatedStyle(() => ({
        borderWidth: 0
    }));
    const animatedTextStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        color: interpolateColor(textColor.value, [0,1], ['white','black'])
    }));

    useEffect(() => {
        rotation.value = withTiming(locked || value === '' ? 0 : rotationDefaultValue, {
            duration: 300,
        });
        borderWidth.value = withTiming(locked && value !== '' ? 2 : 0, {
            duration: 300,
        });
        textColor.value = withTiming(locked || value === null ? 0 : 1);
    }, [locked, value]);

    useEffect(() => {
        scale.value = withSequence(
            withTiming(1.2, { duration: 200 }),
            withTiming(1, { duration: 200 }),
        );
    }, [value]);

    return (
        <Animated.View style={animatedContainerStyle}>
            <AnimatedTouchableOpacity
                style={[styles.dice, {
                    width: diceWidth,
                    height: diceWidth,
                }, (locked || value === null) && styles.lockedDice, animatedBodyStyle]}
                onPress={handlePress}
                disabled={!canPress}
            >
                <Animated.Text style={[styles.diceText, animatedTextStyle]}>{value}</Animated.Text>
                {locked && value !== '' && (
                    <View style={{
                        borderRadius: 99,
                        width: 23, height: 23,
                        backgroundColor: '#CE331F',
                        position: 'absolute',
                        top: -4, right: -4,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: 1
                    }}>
                        <Lock width={11} height={11} fill="#FFF" />
                    </View>
                )}
            </AnimatedTouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    dice: {
        backgroundColor: "white",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    lockedDice: {
        backgroundColor: "rgba(0,0,0,0.5)",
        borderColor: 'red'
    },
    diceText: {
        fontSize: 28,
        fontWeight: "bold",
    },
});

export default Dice;