import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import type { MonthlyPayment } from "@/types";
import styles from "./styles";

const STATUS_CONFIG: Record<
  string,
  { color: string; label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  paid: { color: "#10b981", label: "Pago", icon: "checkmark-circle" },
  pending: { color: "#f59e0b", label: "Pendente", icon: "time" },
  overdue: { color: "#ef4444", label: "Atrasado", icon: "alert-circle" },
  draft: { color: "#94a3b8", label: "Rascunho", icon: "document-text" },
  canceled: { color: "#64748b", label: "Cancelado", icon: "close-circle" },
  failed: { color: "#ef4444", label: "Falha", icon: "warning" },
  default: { color: "#64748b", label: "Desconhecido", icon: "cash" },
};

const formatters = {
  currency: new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }),
  date: (date: Date | string) => new Date(date).toLocaleDateString("pt-BR"),
  month: (monthNumber: number) => {
    const month = new Date(2000, monthNumber - 1, 1).toLocaleString("pt-BR", {
      month: "long",
    });
    return month.charAt(0).toUpperCase() + month.slice(1);
  },
};

interface MonthlyPaymentCardProps {
  payment: MonthlyPayment;
  onPress?: () => void;
}

export const MonthlyPaymentCard = ({
  payment,
  onPress,
}: MonthlyPaymentCardProps) => {
  const { month, year, payment_status, due_date, amount } = payment;

  const statusCfg = STATUS_CONFIG[payment_status] || {
    ...STATUS_CONFIG.default,
    label: payment_status,
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.rowBetween}>
          <Text style={styles.periodText}>
            {formatters.month(month)} {year}
          </Text>
          <Text style={styles.amountText}>
            {formatters.currency.format(amount)}
          </Text>
        </View>

        <View style={styles.rowBetween}>
          <View style={styles.dateInfo}>
            <Ionicons name="calendar-outline" size={14} color="#64748b" />
            <Text style={styles.footerText}>{formatters.date(due_date)}</Text>
          </View>

          <View
            style={[styles.badge, { backgroundColor: `${statusCfg.color}15` }]}
          >
            <Ionicons name={statusCfg.icon} size={14} color={statusCfg.color} />
            <Text style={[styles.badgeText, { color: statusCfg.color }]}>
              {statusCfg.label}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
