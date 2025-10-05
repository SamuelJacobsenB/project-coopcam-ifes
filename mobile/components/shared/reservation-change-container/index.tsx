import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { btnStyles } from "@/styles";

import styles from "./styles";

interface ReservationChangeContainerProps {
  onSave: () => void;
}

export function ReservationChangeContainer({
  onSave,
}: ReservationChangeContainerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alteração detectada</Text>
      <TouchableOpacity style={styles.button} onPress={onSave}>
        <Text style={[btnStyles.btn, btnStyles.btnInfo]}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}
