import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import type { MonthlyPayment, PaymentStatus } from "@/types";

import { styles } from "./styles";

interface MonthlyPaymentCardProps {
  payment: MonthlyPayment;
  onPress?: () => void;
}

const getStatusConfig = (status: PaymentStatus) => {
  const configs: Record<
    string,
    { color: string; label: string; icon: keyof typeof Ionicons.glyphMap }
  > = {
    paid: { color: "#22c55e", label: "Pago", icon: "checkmark-circle" },
    pending: { color: "#eab308", label: "Pendente", icon: "time" },
    overdue: { color: "#ef4444", label: "Atrasado", icon: "alert-circle" },
    draft: { color: "#94a3b8", label: "Rascunho", icon: "document-text" },
    canceled: { color: "#64748b", label: "Cancelado", icon: "close-circle" },
    failed: { color: "#ef4444", label: "Falha", icon: "warning" },
    default: { color: "#64748b", label: status, icon: "cash" },
  };
  return configs[status] || configs.default;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("pt-BR");
};

const getMonthName = (monthNumber: number) => {
  const date = new Date(2000, monthNumber - 1, 1);
  const month = date.toLocaleString("pt-BR", { month: "long" });
  return month.charAt(0).toUpperCase() + month.slice(1);
};

export const MonthlyPaymentCard = ({
  payment,
  onPress,
}: MonthlyPaymentCardProps) => {
  const { month, year, payment_status, due_date, amount } = payment;

  const statusCfg = getStatusConfig(payment_status);
  const monthName = getMonthName(month);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.periodText}>
            {monthName} {year}
          </Text>
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

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#64748b" />
          <Text style={styles.footerText}>{formatDate(due_date)}</Text>
        </View>
        <Text style={styles.amountText}>{formatCurrency(amount)}</Text>
      </View>
    </TouchableOpacity>
  );
};
