import type React from "react";
import { useMemo } from "react"; // Adicionado para performance
import * as ReactCalendar from "react-calendar";

import type { AvailableOverride, UnavailableDay } from "../../../types";
import "./calendar.css";
import styles from "./styles.module.css";

interface CalendarProps {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  availableOverrides: AvailableOverride[];
  unavailableDays: UnavailableDay[];
}

export function Calendar({
  date,
  setDate,
  availableOverrides,
  unavailableDays,
}: CalendarProps) {
  // Memoizamos as checagens para evitar cálculos pesados em cada re-render
  const checkStatus = useMemo(
    () => (targetDate: Date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const checkDate = new Date(targetDate);
      checkDate.setHours(0, 0, 0, 0);

      const isPast = checkDate < today;
      const isWeekend = checkDate.getDay() === 0 || checkDate.getDay() === 6;

      const isOverride = availableOverrides.some(
        (o) =>
          new Date(o.date).toDateString() === checkDate.toDateString() &&
          new Date(o.date) >= today,
      );

      const isUnavailable = unavailableDays.some(
        (d) => new Date(d.date).toDateString() === checkDate.toDateString(),
      );

      const shouldDisable =
        (isPast || isWeekend || isUnavailable) && !isOverride;

      return { shouldDisable };
    },
    [availableOverrides, unavailableDays],
  );

  return (
    <div className={styles.calendarContainer}>
      <ReactCalendar.Calendar
        value={date}
        minDetail="month"
        next2Label={null}
        prev2Label={null}
        locale="pt-BR"
        onChange={(val) => {
          if (val instanceof Date) {
            // Permite a troca de data mesmo para dias indisponíveis
            const corrected = new Date(
              val.getFullYear(),
              val.getMonth(),
              val.getDate(),
              12,
              0,
              0,
            );
            setDate(corrected);
          }
        }}
        tileClassName={({ date, view }) => {
          if (view !== "month") return "";
          return checkStatus(date).shouldDisable ? "unavailable" : "available";
        }}
      />
    </div>
  );
}
