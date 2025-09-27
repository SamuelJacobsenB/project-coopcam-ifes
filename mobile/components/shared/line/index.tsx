import { View, ViewStyle } from "react-native";

import styles from "./styles";

interface LineProps {
  style?: ViewStyle;
}

export function Line({ style: customStyle = {} }: LineProps) {
  return <View style={[styles.line, customStyle]} />;
}
