import { Text } from "react-native";

import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import styles from "./styles";

interface GoBackProps {
  path: string;
}

export function GoBack({ path }: GoBackProps) {
  return (
    <Link href={path as any} style={styles.backContainer}>
      <Ionicons name="chevron-back-outline" size={16} color="black" />
      <Text style={styles.backText}>Voltar</Text>
    </Link>
  );
}
