import { Image, StyleSheet, Text, View } from "react-native";
import Score from "./score.component";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect } from "react";

const Scores = ({ playerIsCurrentTurn, opponentIsCurrentTurn, playerScore, opponentScore }) => {
    const playerAvatarBorderWidth = useSharedValue(1);
    const playerAvatarLeft = useSharedValue(-21);
    const opponentAvatarBorderWidth = useSharedValue(1);
    const opponentAvatarRight = useSharedValue(-21);

    useEffect(() => {
        playerAvatarBorderWidth.value = withTiming(playerIsCurrentTurn ? 4 : 1);
        playerAvatarLeft.value = withTiming(playerIsCurrentTurn ? -24 : -21);
        opponentAvatarBorderWidth.value = withTiming(opponentIsCurrentTurn ? 4 : 1);
        opponentAvatarRight.value = withTiming(opponentIsCurrentTurn ? -24 : -21);
    }, [playerIsCurrentTurn, opponentIsCurrentTurn]);

    const opponentAvatarRightStyle = useAnimatedStyle(() => {
        return {
            right: opponentAvatarRight.value
        }
    });

    return (
        <View style={styles.container}>
            {/* Player Avatar */}
            <Animated.View
                style={{
                    position: 'absolute',
                    left: playerAvatarLeft,
                    zIndex: 99,
                    borderRadius: 99,
                    borderWidth: playerAvatarBorderWidth,
                    borderColor: 'rgba(0,0,0,0.3)',
                }}
            >
                <Image
                    source={{ uri: "https://img.freepik.com/photos-gratuite/concept-liberte-randonneur-montagne_23-2148107064.jpg?size=626&ext=jpg&ga=GA1.1.1788068356.1706313600&semt=ais" }}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 99,
                        objectFit: 'cover',
                    }}
                />
            </Animated.View>
            {/* END Player Avatar */}
            {/* Player Score */}
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 51
                }}
            >
                <Score score={playerScore} />
                <Text style={{
                    color: '#fff',
                    fontWeight: "700"
                }}>Vous</Text>
            </View>
            {/* END Player Score */}
            {/* Opponent Score */}
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 51
                }}
            >
                <Score score={opponentScore} />
                <Text style={{
                    color: '#fff',
                    fontWeight: "800"
                }}>Bot</Text>
            </View>
            {/* END Opponent Score */}
            {/* Opponent Avatar */}
            <Animated.View
                style={[{
                    position: 'absolute',
                    zIndex: 99,
                    borderRadius: 99,
                    borderWidth: opponentAvatarBorderWidth,
                    borderColor: 'rgba(0,0,0,0.3)',
                }, opponentAvatarRightStyle]}
            >
                <Image
                    source={{ uri: "https://as1.ftcdn.net/v2/jpg/02/31/19/64/1000_F_231196474_IT7zKhOFyJCqEJr3b9huL4W0ODVWsZd0.jpg" }}
                    style={{
                        width: 40,
                        height: 40,
                        objectFit: 'cover',
                        borderRadius: 99,
                    }}
                />
            </Animated.View>
            {/* END Opponent Avatar */}

            <LinearGradient
                style={{
                    position: 'absolute',
                    top: 2,
                    left: 2,
                    height: '100%',
                    width: '50%',
                    borderRadius: 3,
                    zIndex: 50
                }}
                colors={['#F67265', '#F75B4E']}
            >

            </LinearGradient>
        </View>
    );
};

export default Scores;

const styles = StyleSheet.create({
    container: {
        maxWidth: 180,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 2,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: 20
    },
    paragraph: {
        color: 'white'
    }
});