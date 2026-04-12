import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

import { Line } from "../../line";
import styles from "./styles";

interface ReservationSectionProps {
  title: string;
  goReserved: boolean;
  returnReserved: boolean;
}

const StatusIndicator = ({
  label,
  isReserved,
}: {
  label: string;
  isReserved: boolean;
}) => (
  <View style={styles.statusRow}>
    <Ionicons
      name={isReserved ? "checkmark-circle" : "close-circle"}
      size={14}
      color={isReserved ? "#34C759" : "#FF3B30"}
    />
    <Text style={[styles.reservationText, isReserved && styles.textReserved]}>
      {label}
    </Text>
  </View>
);

export function ReservationSection({
  title,
  goReserved,
  returnReserved,
}: ReservationSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Line />

      <View style={styles.statusContainer}>
        <StatusIndicator label="Ida" isReserved={goReserved} />
        <StatusIndicator label="Volta" isReserved={returnReserved} />
      </View>
    </View>
  );
}
