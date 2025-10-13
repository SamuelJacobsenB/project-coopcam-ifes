import React from "react";
import { View, Text } from "react-native";
import { Line } from "../line";

import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";

interface AvailableOverride {
  date: Date;
  reason: string;
}

interface UnavailableDay {
  date: Date;
  reason: string;
}

interface DayInfoCardProps {
  date: Date;
  unavailable: UnavailableDay | null;
  override: AvailableOverride | null;
}

export function CalendarDayCard({
  date,
  unavailable,
  override,
}: DayInfoCardProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPast = date < today;
  const weekday = date.getDay();
  const isWeekend = weekday === 0 || weekday === 6;

  let status: string;
  if (unavailable) {
    status = "Indisponível por exceção";
  } else if (!override && (isPast || isWeekend)) {
    status = "Indisponível";
  } else if (override) {
    status = "Disponível por exceção";
  } else {
    status = "Disponível";
  }

  let reason: string;
  if (isPast) {
    reason = "Data passada";
  } else if (unavailable) {
    reason = unavailable.reason;
  } else if (override) {
    reason = override.reason;
  } else if (isWeekend) {
    reason = "Fim de semana";
  } else {
    reason = "Aula normal";
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerDate}>
          <Ionicons name="calendar" size={20} color="black" />
          <Text style={styles.headerText}>
            {date.toLocaleDateString("pt-BR")}
          </Text>
        </View>
      </View>

      <Line />

      <View style={styles.infoRow}>
        <Text style={styles.label}>Status: </Text>
        <Text style={styles.value}>{status}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Motivo: </Text>
        <Text style={styles.value}>{reason}</Text>
      </View>
    </View>
  );
}
