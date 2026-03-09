import { ActivityIndicator, View, Dimensions } from "react-native";

import styles from "./styles";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

export function LoadPage() {
  return (
    <View
      style={[styles.loadPage, { width: screenWidth, height: screenHeight }]}
    >
      <ActivityIndicator color="white" />
    </View>
  );
}
