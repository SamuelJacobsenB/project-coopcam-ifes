import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { format } from "date-fns";

import styles from "./styles";

interface DateInputProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

export function DateInput({ label, value, onChange }: DateInputProps) {
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.inputArea}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.input}
        activeOpacity={0.7}
        onPress={() => setShow(true)}
      >
        <Text
          style={{
            fontSize: 16,
            fontFamily: "Poppins-Regular",
            color: value ? "#333" : "#999",
          }}
        >
          {value ? format(value, "dd/MM/yyyy") : "Selecione uma data"}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
        />
      )}
    </View>
  );
}
