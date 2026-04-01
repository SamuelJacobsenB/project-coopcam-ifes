import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BusTripCard, DateInput, Line } from "@/components";
import { useManyBusTripsByDate } from "@/hooks";
import { colors } from "@/styles";
import { BusTrip } from "@/types";
import { getBusTripsByDate, setBusTripsByDate } from "@/utils";

export default function HomePage() {
  const navigation = useNavigation<any>();
  const params = useLocalSearchParams<{ date?: string }>();

  const { getManyBusTripsByDate: fetchTrips } = useManyBusTripsByDate();

  const [date, setDate] = useState(() => {
    if (params.date) {
      const [year, month, day] = params.date.split("-").map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date();
  });

  const [busTrips, setBusTrips] = useState<BusTrip[]>([]);
  const [loading, setLoading] = useState(false);

  const dateString = useMemo(() => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [date]);

  const loadTrips = useCallback(async () => {
    setLoading(true);
    try {
      // Busca no Storage Local para exibição imediata
      const storedTrips = await getBusTripsByDate(dateString);
      if (storedTrips.length > 0) {
        setBusTrips(storedTrips);
      }

      // Busca na API para atualizar os dados
      const freshTrips = await fetchTrips(dateString);
      if (freshTrips) {
        setBusTrips(freshTrips);
        await setBusTripsByDate(dateString, freshTrips);
      }
    } catch (error) {
      console.error("Erro ao carregar viagens:", error);
    } finally {
      setLoading(false);
    }
  }, [dateString, fetchTrips]);

  useEffect(() => {
    if (params.date !== dateString) {
      navigation.setParams({ date: dateString });
    }
  }, [dateString, navigation, params.date]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Rotas</Text>
      </View>

      <Line />
      <DateInput label="Data" value={date} onChange={setDate} />
      <Line />

      {busTrips.length === 0 && !loading ? (
        <Text style={styles.emptyText}>Nenhuma rota encontrada.</Text>
      ) : (
        <ScrollView
          contentContainerStyle={styles.tripList}
          showsVerticalScrollIndicator={false}
        >
          {busTrips.map((trip) => (
            <BusTripCard
              key={trip.id}
              trip={trip}
              onPress={() =>
                navigation.navigate("bus-trip/[id]", { id: trip.id })
              }
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 24,
    backgroundColor: colors.lightGray,
  },
  header: {
    gap: 12,
  },
  tripList: {
    gap: 12,
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#6c6c6c",
    textAlign: "center",
    marginTop: 20,
  },
});
