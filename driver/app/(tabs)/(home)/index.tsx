import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { BusTripCard, DateInput, Line } from "@/components";
import { useManyBusTripsByDate } from "@/hooks";
import { colors } from "@/styles";
import { BusTrip } from "@/types";
import { useRouter } from "expo-router";

export default function HomePage() {
  const router = useRouter();

  const { getManyBusTripsByDate } = useManyBusTripsByDate();

  const [date, setDate] = useState(new Date());
  const [busTrips, setBusTrips] = useState<BusTrip[]>([]);

  useEffect(() => {
    getManyBusTripsByDate(date.toDateString()).then((trips) =>
      setBusTrips(trips),
    );
  }, [getManyBusTripsByDate, date]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Rotas</Text>
        <DateInput label="Data" value={date} onChange={(d) => setDate(d)} />
      </View>
      <Line />
      <View style={styles.tripList}>
        {busTrips.map((trip) => (
          <BusTripCard
            key={trip.id}
            trip={trip}
            onPress={() => router.navigate(`/bus-trip/${trip.id}`)}
          />
        ))}
      </View>
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
