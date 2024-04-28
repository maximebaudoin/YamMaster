import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from "react-native-reanimated";
import { Lock } from "../../icons/lock.component";

const Dice = ({ index, locked, value, onPress, opponent = false, canPress }) => {
    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
    const rotationDefaultValue = Math.floor(Math.random() * 14 - 7);
    const rotation = useSharedValue(rotationDefaultValue);
    const borderWidth = useSharedValue(0);
    const scale = useSharedValue(1);

    const handlePress = () => {
        if (!opponent) {
            onPress(index);
        }
    };

    const animatedContainerStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));
    const animatedBodyStyle = useAnimatedStyle(() => ({
        borderWidth: borderWidth.value
    }));
    const animatedTextStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }]
    }));

    useEffect(() => {
        rotation.value = withTiming(locked || value === '' ? 0 : rotationDefaultValue, {
            duration: 300,
        });
        borderWidth.value = withTiming(locked && value !== '' ? 2 : 0, {
            duration: 300,
        });
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
                style={[styles.dice, (locked || value === null) && styles.lockedDice, animatedBodyStyle]}
                onPress={handlePress}
                disabled={!canPress}
            >
                <Animated.Text style={[styles.diceText, animatedTextStyle]}>{value}</Animated.Text>
                {locked && value !== '' && (
                    <View style={{
                        borderRadius: 99,
                        width: 18, height: 18,
                        backgroundColor: '#000',
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
        width: 40,
        height: 40,
        backgroundColor: "white",
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    lockedDice: {
        backgroundColor: "gray",
        borderColor: 'red'
    },
    diceText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    opponentText: {
        fontSize: 12,
        color: "red",
    },
});

export default Dice;