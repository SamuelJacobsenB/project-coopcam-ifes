import { useLogout } from "@/hooks";
import { Text, TouchableOpacity, View } from "react-native";

export default function ProfilePage() {
  const { logout } = useLogout();

  return (
    <View>
      <TouchableOpacity onPress={async () => await logout()}>
        <Text>Logout</Text>
      </TouchableOpacity>
      <Text>Profile</Text>
    </View>
  );
}
