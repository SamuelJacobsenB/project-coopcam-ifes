import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  InfoCard,
  MonthlyPaymentCard,
  PaymentDetailContentModal,
  Title,
} from "@/components";
import { useMessage } from "@/contexts";
import { useManyMonthlyPaymentsByOwnUser } from "@/hooks";
import { colors } from "@/styles";
import { MonthlyPayment } from "@/types";

export default function PaymentPage() {
  const { showMessage } = useMessage();
  const { monthlyPayments, isLoading, refetch } =
    useManyMonthlyPaymentsByOwnUser();
  const [selectedPayment, setSelectedPayment] = useState<MonthlyPayment | null>(
    null,
  );

  const prevStatusRef = useRef<string | undefined>(null);

  const currentSelected = useMemo(
    () =>
      monthlyPayments?.find((p) => p.id === selectedPayment?.id) ||
      selectedPayment,
    [monthlyPayments, selectedPayment],
  );

  const { pendingPayments, paidPayments } = useMemo(() => {
    const all = monthlyPayments || [];
    return {
      pendingPayments: all.filter(
        (p) => p.payment_status !== "draft" && p.payment_status !== "paid",
      ),
      paidPayments: all.filter((p) => p.payment_status === "paid"),
    };
  }, [monthlyPayments]);

  useEffect(() => {
    if (!selectedPayment || currentSelected?.payment_status === "paid") return;

    const intervalId = setInterval(refetch, 5000);
    return () => clearInterval(intervalId);
  }, [selectedPayment, currentSelected?.payment_status, refetch]);

  useEffect(() => {
    const status = currentSelected?.payment_status;

    if (
      prevStatusRef.current &&
      prevStatusRef.current !== "paid" &&
      status === "paid"
    ) {
      showMessage("Pagamento realizado com sucesso!", "success");
    }
    prevStatusRef.current = status;
  }, [currentSelected?.payment_status, showMessage]);

  const renderSection = (
    title: string,
    data: MonthlyPayment[],
    emptyMsg: string,
  ) => (
    <InfoCard title={title}>
      {data.length > 0 ? (
        <View style={styles.list}>
          {data.map((payment) => (
            <MonthlyPaymentCard
              key={payment.id}
              payment={payment}
              onPress={() => setSelectedPayment(payment)}
            />
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>{emptyMsg}</Text>
      )}
    </InfoCard>
  );

  return (
    <View style={styles.container}>
      <Title>Pagamentos</Title>

      {isLoading && !monthlyPayments ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderSection(
            "Pendentes",
            pendingPayments,
            "Nenhum pagamento pendente.",
          )}
          {renderSection(
            "Histórico",
            paidPayments,
            "Nenhum histórico de pagamento.",
          )}
        </ScrollView>
      )}

      <PaymentDetailContentModal
        payment={currentSelected}
        isOpen={!!selectedPayment}
        onClose={() => setSelectedPayment(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: colors.lightGray,
  },
  headerTitle: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 8,
  },
  scrollContent: {
    paddingBottom: 40,
    gap: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    gap: 12,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingVertical: 20,
  },
});
