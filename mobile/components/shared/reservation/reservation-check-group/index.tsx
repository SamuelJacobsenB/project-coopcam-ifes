import React from "react";
import { Text, View } from "react-native";

import { Line } from "../../line";
import { CheckBox } from "../../form/check-box";

import styles from "./styles";

interface ReservationCheckGroupProps {
  title: string;
  goChecked: boolean;
  returnChecked: boolean;
  onToggleGo: () => void;
  onToggleReturn: () => void;
}

export function ReservationCheckGroup({
  title,
  goChecked,
  returnChecked,
  onToggleGo,
  onToggleReturn,
}: ReservationCheckGroupProps) {
  return (
    <View style={styles.reservationContainer}>
      <Text style={styles.reservationTitle}>{title}</Text>
      <Line />
      <View style={styles.checkboxesContainer}>
        <CheckBox isChecked={goChecked} text="Ida" onPress={onToggleGo} />
        <CheckBox
          isChecked={returnChecked}
          text="Volta"
          onPress={onToggleReturn}
        />
      </View>
    </View>
  );
}
