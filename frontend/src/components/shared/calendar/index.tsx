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

// ... (imports)

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
        minDetail="month" // Impede que o utilizador navegue até à vista de anos/décadas
        next2Label={null} // Remove botões de "saltar" anos para simplificar
        prev2Label={null}
        onChange={(val) => {
          // Lógica de correção de horas mantida para evitar bugs de fuso horário
          if (val instanceof Date) {
            const corrected = new Date(val);
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

          // Verifica se há exceção de disponibilidade
          const isOverride = availableOverrides.some((o) => {
            const overrideDate = new Date(o.date);
            return (
              overrideDate.toDateString() === date.toDateString() &&
              overrideDate >= today
            );
          });

          // Verifica se foi marcado manualmente como indisponível
          const isUnavailable = unavailableDays.some(
            (d) => new Date(d.date).toDateString() === date.toDateString()
          );

          if ((isPast || isWeekend || isUnavailable) && !isOverride) {
            return "unavailable";
          }

          return "";
        }}
      />
    </div>
  );
}
