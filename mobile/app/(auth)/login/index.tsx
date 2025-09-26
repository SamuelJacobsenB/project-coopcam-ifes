import { Link } from "expo-router";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function LoginPage() {
  return (
    <View>
      <Text>Login</Text>
      <Link href="/" asChild>
        <Text>Login</Text>
      </Link>
    </View>
  );
}
