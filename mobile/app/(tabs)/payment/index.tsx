import React, { useEffect, useRef, useState } from "react";
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

  const prevStatusRef = useRef<string | undefined>(undefined);

  const currentSelected: MonthlyPayment | null =
    monthlyPayments?.find((p) => p.id === selectedPayment?.id) ||
    selectedPayment;

  useEffect(() => {
    let intervalId: number;

    const needsVerification =
      selectedPayment && currentSelected?.payment_status !== "paid";

    if (needsVerification) {
      intervalId = setInterval(() => {
        refetch();
      }, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedPayment, currentSelected?.payment_status, refetch]);

  useEffect(() => {
    if (currentSelected) {
      if (
        prevStatusRef.current &&
        prevStatusRef.current !== "paid" &&
        currentSelected.payment_status === "paid" &&
        !!selectedPayment
      ) {
        showMessage(`O pagamento foi realizado com sucesso`, "success");
      }

      prevStatusRef.current = currentSelected.payment_status;
    } else {
      prevStatusRef.current = undefined;
    }
  }, [
    currentSelected?.payment_status,
    showMessage,
    selectedPayment,
    currentSelected,
  ]);

  const pendingPayments =
    monthlyPayments?.filter(
      (p) => p.payment_status !== "draft" && p.payment_status !== "paid",
    ) || [];

  const paidPayments =
    monthlyPayments?.filter((p) => p.payment_status === "paid") || [];

  return (
    <View style={styles.container}>
      <Title>Pagamentos</Title>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <InfoCard title="Pendentes">
            {pendingPayments.length > 0 ? (
              <View style={styles.list}>
                {pendingPayments.map((payment) => (
                  <MonthlyPaymentCard
                    key={payment.id}
                    payment={payment}
                    onPress={() => setSelectedPayment(payment)}
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>
                Nenhum pagamento pendente encontrado.
              </Text>
            )}
          </InfoCard>

          <InfoCard title="Pagos">
            {paidPayments.length > 0 ? (
              <View style={styles.list}>
                {paidPayments.map((payment) => (
                  <MonthlyPaymentCard
                    key={payment.id}
                    payment={payment}
                    onPress={() => setSelectedPayment(payment)}
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.emptyText}>
                Nenhum histórico de pagamento.
              </Text>
            )}
          </InfoCard>
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
    paddingTop: 16,
    backgroundColor: colors.lightGray,
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    flexDirection: "column",
    gap: 12,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#353535",
    textAlign: "center",
    paddingVertical: 16,
    fontStyle: "italic",
  },
});
