import React, { useMemo } from "react";
import { View } from "react-native";
import {
  Calendar as RNCalendar,
  DateData,
  LocaleConfig,
} from "react-native-calendars";
import { MarkingProps } from "react-native-calendars/src/calendar/day/marking";

import type { AvailableOverride, UnavailableDay } from "@/types";
import { colors } from "@/styles";
import styles from "./styles";

// Configuração de Localização (Mantida)
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
  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

// Função auxiliar interna (caso não crie o utils.ts)
function toDateId(date: Date): string {
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
  // Data base para cálculos
  const today = useMemo(() => new Date(), []);
  const todayId = toDateId(today);

  // Lógica de marcação memoizada
  const markedDates = useMemo(() => {
    const markings: Record<string, MarkingProps> = {};

    // Set de Overrides para busca rápida O(1)
    const overrideSet = new Set(
      availableOverrides.map((o) => toDateId(o.date))
    );

    // 1. Marcação de Finais de Semana (Range de 1 ano futuro para performance)
    // Usamos minDate para o passado, então focamos no futuro aqui.
    for (let i = 0; i <= 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);

      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // 0=Dom, 6=Sáb
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

    // 2. Dias especificamente indisponíveis (Feriados, lotados, etc)
    unavailableDays.forEach((d) => {
      const key = toDateId(d.date);
      // Se tiver override, ignoramos a indisponibilidade
      if (!overrideSet.has(key)) {
        markings[key] = {
          disabled: true,
          customStyles: {
            container: styles.unavailable,
            text: styles.unavailableText,
          },
        };
      }
    });

    // 3. Dias de Exceção (Overrides - Disponível mesmo se for FDS/Indisponível)
    availableOverrides.forEach((o) => {
      const key = toDateId(o.date);
      markings[key] = {
        disabled: false, // Força habilitação
        customStyles: {
          container: styles.override,
          text: styles.overrideText,
        },
      };
    });

    // 4. Marca o dia Selecionado
    const selectedKey = toDateId(date);
    const existingMarking = markings[selectedKey] || {};

    markings[selectedKey] = {
      ...existingMarking,
      selected: true,
      // Prioriza o estilo de selecionado, mas mantém container base se necessário
      customStyles: {
        container: styles.selected,
        text: styles.selectedText,
      },
    };

    return markings;
  }, [availableOverrides, unavailableDays, date, today]); // Recalcula apenas se estas mudarem

  return (
    <View style={styles.container}>
      <RNCalendar
        // Propriedade chave para bloquear o passado nativamente
        minDate={todayId}
        current={toDateId(date)}
        onDayPress={(day: DateData) => {
          // Cria data meio-dia para evitar problemas de fuso horário 00:00 vs GMT
          const newDate = new Date(day.year, day.month - 1, day.day, 12, 0, 0);
          setDate(newDate);
        }}
        markingType="custom"
        markedDates={markedDates}
        // Melhorias visuais e de UX
        enableSwipeMonths={true}
        hideExtraDays={true}
        theme={{
          todayTextColor: colors.warning,
          arrowColor: colors.primary,
          textMonthFontSize: 18,
          textDayHeaderFontWeight: "600",
          // Garante que o fundo do calendário seja transparente ou da cor desejada
          calendarBackground: "transparent",
          textSectionTitleColor: colors.gray,
        }}
      />
    </View>
  );
}
