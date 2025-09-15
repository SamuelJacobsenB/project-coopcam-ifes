import type React from "react";
import * as ReactCalendar from "react-calendar";

import type { AvailableOverride, UnavailableDay } from "../../../types";
import styles from "./styles.module.css"; // Para container e layout
import "./calendar.css"; // Para classes globais do calendário

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
  return (
    <div className={styles.calendarContainer}>
      <ReactCalendar.Calendar
        value={date}
        onChange={(val) => {
          if (val instanceof Date) {
            const corrected = new Date(val);
            corrected.setHours(12);
            setDate(corrected);
          } else if (Array.isArray(val) && val[0] instanceof Date) {
            const corrected = new Date(val[0]);
            corrected.setHours(12);
            setDate(corrected);
          }
        }}
        tileClassName={({ date, view }) => {
          if (view !== "month") return "";

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const isPast = date < today;
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;

          const isOverride = availableOverrides.some((o) => {
            const overrideDate = new Date(o.date);
            overrideDate.setHours(0, 0, 0, 0);
            return (
              overrideDate.toDateString() === date.toDateString() &&
              overrideDate >= today
            );
          });

          const isUnavailable = unavailableDays.some(
            (d) => new Date(d.date).toDateString() === date.toDateString()
          );

          if ((isPast || isWeekend || isUnavailable) && !isOverride) {
            return "unavailable";
          }

          if (isOverride) return "override";

          return "";
        }}
        prev2Label={null}
        next2Label={null}
      />
    </div>
  );
}
