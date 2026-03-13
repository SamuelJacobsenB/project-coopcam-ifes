import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useRouter } from "expo-router";

import { BusTripCard, DateInput, Line } from "@/components";
import { useManyBusTripsByDate } from "@/hooks";
import { colors } from "@/styles";
import { BusTrip } from "@/types";

export default function HomePage() {
  const router = useRouter();

  const { getManyBusTripsByDate } = useManyBusTripsByDate();

  const [date, setDate] = useState(new Date());
  const [busTrips, setBusTrips] = useState<BusTrip[]>([]);

  useEffect(() => {
    getManyBusTripsByDate(date.toISOString().split("T")[0]).then((trips) =>
      setBusTrips(trips),
    );
  }, [getManyBusTripsByDate, date]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Rotas</Text>
      </View>

      <Line />
      <DateInput label="Data" value={date} onChange={(d) => setDate(d)} />
      <Line />

      {busTrips.length === 0 && (
        <Text style={{ fontSize: 16, color: "#6c6c6c", textAlign: "center" }}>
          Nenhuma rota encontrada para a data selecionada.
        </Text>
      )}

      {busTrips.length > 0 && (
        <View style={styles.tripList}>
          {busTrips.map((trip) => (
            <BusTripCard
              key={trip.id}
              trip={trip}
              onPress={() => router.navigate(`/bus-trip/${trip.id}`)}
            />
          ))}
        </View>
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
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  tripList: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
});
