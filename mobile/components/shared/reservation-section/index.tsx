import { View, Text } from "react-native";

import { Line } from "../line";

import styles from "./styles";

interface ReservationSectionProps {
  title: string;
  goReserved: boolean;
  returnReserved: boolean;
}

export function ReservationSection({
  title,
  goReserved,
  returnReserved,
}: ReservationSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Line style={styles.sectionLine} />
      <Text style={styles.reservationText}>
        Ida: {goReserved ? "Reservado" : "Não reservado"}
      </Text>
      <Text style={styles.reservationText}>
        Volta: {returnReserved ? "Reservado" : "Não reservado"}
      </Text>
    </View>
  );
}
