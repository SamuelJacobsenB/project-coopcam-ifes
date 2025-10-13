import React from "react";
import { View } from "react-native";
import {
  Calendar as RNCalendar,
  DateData,
  LocaleConfig,
} from "react-native-calendars";

import type { AvailableOverride, UnavailableDay } from "@/types";
import { colors } from "@/styles";
import styles from "./styles";

// Localização em português
LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  dayNames: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

function formatDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

interface CalendarProps {
  date: Date;
  setDate: (date: Date) => void;
  availableOverrides: AvailableOverride[];
  unavailableDays: UnavailableDay[];
}

export function Calendar({
  date,
  setDate,
  availableOverrides,
  unavailableDays,
}: CalendarProps) {
  const markings: Record<string, any> = {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Dias indisponíveis exceto Override
  for (let i = 0; i <= 720; i++) {
    const d = new Date();

    d.setDate(today.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const key = formatDateKey(d);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const hasOverride = availableOverrides.some(
      (o) => formatDateKey(o.date) === key
    );

    if ((isWeekend || d < today) && !hasOverride) {
      markings[key] = {
        disabled: true,
        customStyles: {
          container: styles.unavailable,
          text: styles.unavailableText,
        },
      };
    }
  }

  // Finais de semana futuros
  for (let i = 0; i <= 720; i++) {
    const d = new Date();

    d.setDate(today.getDate() + i);
    d.setHours(0, 0, 0, 0);

    const key = formatDateKey(d);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const hasOverride = availableOverrides.some(
      (o) => formatDateKey(o.date) === key
    );

    if (isWeekend && !hasOverride) {
      markings[key] = {
        disabled: true,
        customStyles: {
          container: styles.unavailable,
          text: styles.unavailableText,
        },
      };
    }
  }

  // Dias indisponíveis
  unavailableDays.forEach((d) => {
    const key = formatDateKey(d.date);
    const hasOverride = availableOverrides.some(
      (o) => formatDateKey(o.date) === key
    );
    if (!hasOverride) {
      markings[key] = {
        disabled: true,
        customStyles: {
          container: styles.unavailable,
          text: styles.unavailableText,
        },
      };
    }
  });

  // Dias disponíveis
  availableOverrides.forEach((o) => {
    const key = formatDateKey(o.date);
    markings[key] = {
      customStyles: {
        container: styles.override,
        text: styles.overrideText,
      },
    };
  });

  // Marca selecionado
  const selectedKey = formatDateKey(date);
  markings[selectedKey] = {
    ...markings[selectedKey],
    selected: true,
    customStyles: {
      container: styles.selected,
      text: styles.selectedText,
    },
  };

  return (
    <View style={styles.container}>
      <RNCalendar
        current={selectedKey}
        onDayPress={(day: DateData) => {
          const [y, m, d] = day.dateString.split("-").map(Number);
          const newDate = new Date(y, m - 1, d, 12);
          setDate(newDate);
        }}
        markingType="custom"
        markedDates={markings}
        theme={{
          todayTextColor: colors.warning,
          arrowColor: colors.primary,
          textMonthFontSize: 18,
          textDayHeaderFontWeight: "600",
        }}
      />
    </View>
  );
}
