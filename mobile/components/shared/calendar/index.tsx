import React, { useMemo } from "react";
import { View } from "react-native";
import { DateData, Calendar as RNCalendar } from "react-native-calendars";
import { MarkingProps } from "react-native-calendars/src/calendar/day/marking";

import { colors } from "@/styles";
import type { AvailableOverride, UnavailableDay } from "@/types";
import styles from "./styles";

function toDateId(dateInput: Date | string | undefined): string {
  if (!dateInput) return "";

  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
  availableOverrides = [],
  unavailableDays = [],
}: CalendarProps) {
  const today = useMemo(() => new Date(), []);
  const todayId = toDateId(today);

  const markedDates = useMemo(() => {
    const markings: Record<string, MarkingProps> = {};

    const overrideSet = new Set(
      availableOverrides.map((o) => toDateId(o.date)),
    );

    for (let i = 0; i <= 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const key = toDateId(d);

      if (isWeekend && !overrideSet.has(key)) {
        markings[key] = {
          disabled: true,
          customStyles: {
            container: styles.unavailable,
            text: styles.unavailableText,
          },
        };
      }
    }

    unavailableDays.forEach((d) => {
      const key = toDateId(d.date);
      if (key && !overrideSet.has(key)) {
        markings[key] = {
          disabled: true,
          disableTouchEvent: true,
          customStyles: {
            container: styles.unavailable,
            text: styles.unavailableText,
          },
        };
      }
    });

    availableOverrides.forEach((o) => {
      const key = toDateId(o.date);
      if (key) {
        markings[key] = {
          disabled: false,
          customStyles: {
            container: styles.override,
            text: styles.overrideText,
          },
        };
      }
    });

    const selectedKey = toDateId(date);
    if (selectedKey) {
      const existing = markings[selectedKey] || {};
      markings[selectedKey] = {
        ...existing,
        selected: true,
        customStyles: {
          container: styles.selected,
          text: styles.selectedText,
        },
      };
    }

    return markings;
  }, [availableOverrides, unavailableDays, date, today]);

  return (
    <View style={styles.container}>
      <RNCalendar
        minDate={todayId}
        current={toDateId(date)}
        onDayPress={(day: DateData) => {
          const newDate = new Date(day.year, day.month - 1, day.day, 12, 0, 0);
          setDate(newDate);
        }}
        markingType="custom"
        markedDates={markedDates}
        enableSwipeMonths={true}
        hideExtraDays={true}
        theme={{
          todayTextColor: colors.warning,
          arrowColor: colors.primary,
          textMonthFontSize: 18,
          textDayHeaderFontWeight: "600",
          calendarBackground: "transparent",
          textSectionTitleColor: colors.gray,
        }}
      />
    </View>
  );
}
