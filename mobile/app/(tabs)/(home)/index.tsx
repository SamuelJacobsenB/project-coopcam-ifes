import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function HomePage() {
  return (
    <View>
      <Text>Home</Text>
      <Link href="/login" asChild>
        <Text>Login</Text>
      </Link>
    </View>
  );
}
