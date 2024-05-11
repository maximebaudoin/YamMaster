import { Image, StyleSheet, View } from "react-native";
import Button from "../components/button.component";
import LottieView from 'lottie-react-native';
import { EarthEurope } from "../components/icons/earth-europe.component";
import { Robot } from "../components/icons/robot.component";

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Image
                style={{
                    width: 200,
                    height: 200,
                    objectFit: 'contain',
                    borderRadius: 30
                }}
                source={require('../../assets/logo.png')}
            />
            <View style={{
                gap: 10,
                marginVertical: 30,
                alignItems: 'center'
            }}>
                <View>
                    <Button
                        handlePress={() => navigation.navigate('OnlineGameScreen')}
                        theme="primary"
                        leftIcon={EarthEurope}
                    >Jouer en ligne</Button>
                </View>
                <View>
                    <Button
                        handlePress={() => navigation.navigate('VsBotGameScreen')}
                        // theme="primary"
                        leftIcon={Robot}
                    >Jouer contre le bot</Button>
                </View>
            </View>
            <LottieView
                autoPlay
                style={{
                    width: 200,
                    height: 200,
                }}
                source={require('../../assets/lottie/dice.json')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#22292F",
        alignItems: "center",
        justifyContent: "center",
    }
});