import { View, ViewStyle } from "react-native";

import styles from "./styles";

interface LineProps {
  styles?: ViewStyle;
}

export function Line({ styles: customStyle = {} }: LineProps) {
  return <View style={[styles.line, customStyle]} />;
}
