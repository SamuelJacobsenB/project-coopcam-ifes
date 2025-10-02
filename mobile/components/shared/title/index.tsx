import { Text } from "react-native";

import { Line } from "../line";

import styles from "./styles";

interface TitleProps {
  children: React.ReactNode;
}

export function Title({ children }: TitleProps) {
  return (
    <>
      <Text style={styles.title}>{children}</Text>
      <Line style={styles.line} />
    </>
  );
}
