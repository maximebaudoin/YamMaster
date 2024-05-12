import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SocketContext } from "../../../contexts/socket.context";

const Choices = () => {

    const socket = useContext(SocketContext);

    const [displayChoices, setDisplayChoices] = useState(false);
    const [canMakeChoice, setCanMakeChoice] = useState(false);
    const [idSelectedChoice, setIdSelectedChoice] = useState(null);
    const [availableChoices, setAvailableChoices] = useState([]);

    useEffect(() => {
        socket.on("game.choices.view-state", (data) => {
            setDisplayChoices(data['displayChoices']);
            setCanMakeChoice(data['canMakeChoice']);
            setIdSelectedChoice(data['idSelectedChoice']);
            setAvailableChoices(data['availableChoices']);
        });
    }, []);

    const handleSelectChoice = (choiceId) => {
        if (canMakeChoice) {
            setIdSelectedChoice(choiceId);
            socket.emit("game.choices.selected", { choiceId });
        }
    };

    return (
        <View style={styles.choicesContainer}>
            {displayChoices &&
                availableChoices.map((choice) => (
                    <TouchableOpacity
                        key={choice.id}
                        style={[
                            styles.choiceButton,
                            idSelectedChoice === choice.id && styles.selectedChoice,
                            !canMakeChoice && styles.disabledChoice
                        ]}
                        onPress={() => handleSelectChoice(choice.id)}
                        disabled={!canMakeChoice}
                    >
                        <Text style={styles.choiceText}>{choice.value}</Text>
                    </TouchableOpacity>
                ))}
        </View>
    );
};

const styles = StyleSheet.create({
    choicesContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-end",
        paddingLeft: 7,
        paddingVertical: 7,
        backgroundColor: "rgba(0,0,0,0.3)",
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        gap: 5
    },
    choiceButton: {
        backgroundColor: "white",
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 5,
        paddingLeft: 3,
        paddingRight: 0,
        width: "100%"
    },
    selectedChoice: {
        backgroundColor: "rgba(255,100,255,0.8)",
    },
    choiceText: {
        fontSize: 13,
        fontWeight: "bold",
        textAlign: 'left'
    },
    disabledChoice: {
        opacity: 0.5,
    },
});

export default Choices;