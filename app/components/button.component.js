import { StyleSheet, Text, TouchableOpacity } from "react-native";


const Button = ({ leftIcon = null, rightIcon = null, handlePress = () => { }, children = "", theme = "danger" }) => {
    const LeftIcon = leftIcon;
    const RightIcon = rightIcon;

    const backgroundColor = theme === "danger" ? "#CE331F" : "#1D74D0";

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: backgroundColor }]}
            onPress={handlePress}
        >
            {LeftIcon && <LeftIcon width={22} height={22} fill="#FFF" />}
            <Text style={styles.text}>{children}</Text>
            {RightIcon && <RightIcon width={22} height={22} fill="#FFF" />}
        </TouchableOpacity>
    );

}

export default Button;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 9,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12
    },
    text: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: "600"
    }
});