import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { View, TouchableOpacity } from "react-native";

export default function Header() {
    const navigation = useNavigation()
  return (
    <View style={{ padding: 15 }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <AntDesign name="arrowleft" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
