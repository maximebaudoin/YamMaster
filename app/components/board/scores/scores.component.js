import { Image, StyleSheet, Text, View } from "react-native";
import PlayerScore from "./player-score.component";
import OpponentScore from "./opponent-score.component";
import { LinearGradient } from "expo-linear-gradient";

const Scores = () => {
    return (
        <View style={styles.container}>
            <View
                style={{
                    position: 'absolute',
                    left: -20,
                    zIndex: 99
                }}
            >
                <Image
                    source={{ uri: "https://img.freepik.com/photos-gratuite/concept-liberte-randonneur-montagne_23-2148107064.jpg?size=626&ext=jpg&ga=GA1.1.1788068356.1706313600&semt=ais" }}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 99,
                        objectFit: 'cover'
                    }}
                />
            </View>
            <LinearGradient
                style={{
                    borderRadius: 3,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                colors={['#F67265', '#F75B4E']}
            >
                <PlayerScore />
            </LinearGradient>
            <View
                style={{
                    borderRadius: 3,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <OpponentScore />
            </View>
            <View
                style={{
                    position: 'absolute',
                    right: -20,
                    zIndex: 99
                }}
            >
                <Image
                    source={{ uri: "https://as1.ftcdn.net/v2/jpg/02/31/19/64/1000_F_231196474_IT7zKhOFyJCqEJr3b9huL4W0ODVWsZd0.jpg" }}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 99,
                        objectFit: 'cover'
                    }}
                />
            </View>
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
        borderRadius: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    paragraph: {
        color: 'white'
    }
});