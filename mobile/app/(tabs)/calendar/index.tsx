import React, { useState, useMemo } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

import { useAllAvailableOverrides, useAllUnavailableDays } from "@/hooks";
import { Calendar, LoadPage, Title, CalendarDayCard } from "@/components";
import { colors } from "@/styles";

const toDateId = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function CalendarPage() {
  // Hooks de dados
  const {
    availableOverrides,
    isLoading: loadingOverrides,
    error: overridesError,
  } = useAllAvailableOverrides();

  const {
    unavailableDays,
    isLoading: loadingUnavailable,
    error: unavailableError,
  } = useAllUnavailableDays();

  // Estado local
  const [date, setDate] = useState(() => new Date());

  // Lógica de Seleção Otimizada (Memoizada)
  // Só recalcula se a data selecionada ou os dados da API mudarem
  const { selectedOverride, selectedUnavailable } = useMemo(() => {
    const dayKey = toDateId(date);

    // Evita crash se os dados vierem undefined
    const overrides = availableOverrides ?? [];
    const unavailables = unavailableDays ?? [];

    return {
      selectedOverride:
        overrides.find((o) => toDateId(o.date) === dayKey) || null,
      selectedUnavailable:
        unavailables.find((u) => toDateId(u.date) === dayKey) || null,
    };
  }, [date, availableOverrides, unavailableDays]);

  // Loading State
  if (loadingOverrides || loadingUnavailable) {
    return <LoadPage />;
  }

  // Verificação de Erros
  const hasError = overridesError || unavailableError;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Title>Calendário</Title>

      <View style={styles.scrollContent}>
        {hasError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Ocorreu um problema ao carregar os dados do calendário.
            </Text>
            {/* Aqui você poderia colocar um botão de "Tentar Novamente" */}
          </View>
        ) : (
          <>
            <Calendar
              date={date}
              setDate={setDate}
              availableOverrides={availableOverrides ?? []}
              unavailableDays={unavailableDays ?? []}
            />

            <View style={styles.cardContainer}>
              <CalendarDayCard
                date={date}
                override={selectedOverride}
                unavailable={selectedUnavailable}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
    padding: 16,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  cardContainer: {
    marginTop: 24,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#FFECEC",
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    textAlign: "center",
    fontSize: 14,
  },
});
