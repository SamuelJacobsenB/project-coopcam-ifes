import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { DayCard, Line } from "@/components";
import { useWeeklyPreferenceByUserId } from "@/hooks";
import { BusReservation } from "@/types";
import { getDateOfWeekDay, getWeekDay } from "@/utils";
import { weekDays } from "@/constants";

export default function HomePage() {
  const { weeklyPreference, isLoading, error } = useWeeklyPreferenceByUserId();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferêrcia semanal</Text>
      <Line style={styles.line} />
      {isLoading && (
        <View>
          <ActivityIndicator color={"black"} />
        </View>
      )}
      {error && <Text>Preferência semanal não encontrada.</Text>}
      {weeklyPreference && (
        <FlatList
          contentContainerStyle={styles.list}
          data={weekDays}
          renderItem={({ item: day, index }) => {
            const currentDate = getDateOfWeekDay(index);

            const busReservations = weeklyPreference.overrides.filter(
              (busReservation: BusReservation) =>
                getWeekDay(busReservation.date.getDay()) === day
            );

            const morningAndGo = busReservations.filter(
              (busReservation: BusReservation) =>
                busReservation.period === "morning" &&
                busReservation.direction === "go"
            );
            const morningAndReturn = busReservations.filter(
              (busReservation: BusReservation) =>
                busReservation.period === "morning" &&
                busReservation.direction === "return"
            );

            const afternoonAndGo = busReservations.filter(
              (busReservation: BusReservation) =>
                busReservation.period === "afternoon" &&
                busReservation.direction === "go"
            );
            const afternoonAndReturn = busReservations.filter(
              (busReservation: BusReservation) =>
                busReservation.period === "afternoon" &&
                busReservation.direction === "return"
            );

            return (
              <DayCard key={day} date={currentDate} onPress={() => {}}>
                {
                  //revisar date!!!!!!!!!!!!!!!!
                }
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Manhã</Text>
                  <Line />
                  <Text style={styles.reservationText}>
                    Ida:{" "}
                    {morningAndGo.length === 1 ? "Reservado" : "Não reservado"}
                  </Text>
                  <Text style={styles.reservationText}>
                    Volta:{" "}
                    {morningAndReturn.length === 1
                      ? "Reservado"
                      : "Não reservado"}
                  </Text>
                </View>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Tarde</Text>
                  <Line />
                  <Text style={styles.reservationText}>
                    Ida:{" "}
                    {afternoonAndGo.length === 1
                      ? "Reservado"
                      : "Não reservado"}
                  </Text>
                  <Text style={styles.reservationText}>
                    Volta:{" "}
                    {afternoonAndReturn.length === 1
                      ? "Reservado"
                      : "Não reservado"}
                  </Text>
                </View>
              </DayCard>
            );
          }}
          keyExtractor={(day) => day}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: "#F9F9F9",
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    marginBottom: 8,
  },
  line: {
    marginBottom: 24,
  },
  list: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 18,
    columnGap: 12,
    overflowY: "auto",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  sectionLine: {
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Poppins-Bold",
    color: "#555",
  },
  reservationText: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    color: "#444",
  },
});
