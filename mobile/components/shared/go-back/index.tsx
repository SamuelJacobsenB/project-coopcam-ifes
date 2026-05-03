import React from "react";
import { Text, TouchableOpacity } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";

import styles from "./styles";

interface GoBackProps {
  path: Href;
}

export function GoBack({ path }: GoBackProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(path)}
      activeOpacity={0.7}
    >
      <Ionicons name="chevron-back" size={20} color="#666" />
      <Text style={styles.text}>Voltar</Text>
    </TouchableOpacity>
  );
}
