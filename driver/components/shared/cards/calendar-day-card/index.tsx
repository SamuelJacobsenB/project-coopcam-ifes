import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Line } from "../../line";
import { AvailableOverride, UnavailableDay } from "@/types";
import { colors } from "@/styles";

import styles from "./styles";

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
  const cardState = useMemo(() => {
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isPast = checkDate.getTime() < today.getTime();
    const isToday = checkDate.getTime() === today.getTime();

    // 0 = Domingo, 6 = Sábado
    const dayOfWeek = checkDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // 2. Determinar Estado, Cor e Ícone
    if (isPast) {
      return {
        status: "Data Passada",
        reason: "Período encerrado",
        color: colors.gray || "#9CA3AF",
        bgColor: "#F3F4F6",
        icon: "time-outline",
        isAvailable: false,
      };
    }

    if (unavailable) {
      return {
        status: "Indisponível",
        reason: unavailable.reason,
        color: colors.error || "#EF4444", // Vermelho
        bgColor: "#FEF2F2",
        icon: "close-circle-outline",
        isAvailable: false,
      };
    }

    if (override) {
      return {
        status: "Exceção Disponível",
        reason: override.reason,
        color: colors.primary || "#3B82F6", // Azul/Primary
        bgColor: "#EFF6FF",
        icon: "alert-circle-outline", // Ícone de atenção positiva
        isAvailable: true,
      };
    }

    if (isWeekend) {
      return {
        status: "Fim de Semana",
        reason: "Não há aulas regulares",
        color: colors.warning || "#F59E0B", // Laranja
        bgColor: "#FFFBEB",
        icon: "calendar-outline",
        isAvailable: false,
      };
    }

    // Padrão (Dia útil futuro normal)
    return {
      status: "Disponível",
      reason: isToday ? "Aula hoje" : "Aula normal",
      color: colors.success || "#10B981", // Verde
      bgColor: "#ECFDF5",
      icon: "checkmark-circle-outline",
      isAvailable: true,
    };
  }, [date, unavailable, override]);

  return (
    <View style={styles.card}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerDate}>
          <Ionicons name="calendar-clear" size={22} color={colors.primary} />
          <Text style={styles.headerText}>
            {date.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              weekday: "short",
            })}
          </Text>
        </View>
      </View>

      <Line />

      {/* Conteúdo Dinâmico */}
      <View style={styles.infoContainer}>
        {/* Linha de Status com Badge */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Situação</Text>
          <View
            style={[styles.statusBadge, { backgroundColor: cardState.bgColor }]}
          >
            <Ionicons
              name={cardState.icon as any}
              size={16}
              color={cardState.color}
            />
            <Text style={[styles.statusText, { color: cardState.color }]}>
              {cardState.status}
            </Text>
          </View>
        </View>

        {/* Linha de Motivo */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Detalhe</Text>
          <Text
            style={[
              styles.value,
              styles.reasonValue,
              { color: cardState.isAvailable ? "#374151" : cardState.color },
            ]}
            numberOfLines={2}
          >
            {cardState.reason}
          </Text>
        </View>
      </View>
    </View>
  );
}
