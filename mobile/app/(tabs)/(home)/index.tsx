import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { DayCard, Line, ReservationSection, Title } from "@/components";
import { useWeeklyPreferenceByUserId } from "@/hooks";
import { filterReservations, getDateOfWeekDay, getWeekDay } from "@/utils";
import { weekDays } from "@/constants";
import { colors } from "@/styles";

export default function HomePage() {
  const { weeklyPreference, isLoading, error } = useWeeklyPreferenceByUserId();

  return (
    <View style={styles.container}>
      <Title>Preferência semanal</Title>
      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator color={"black"} />
        </View>
      )}
      {error && <Text>Preferência semanal não encontrada.</Text>}
      {weeklyPreference && (
        <FlatList
          contentContainerStyle={styles.list}
          data={weekDays}
          renderItem={({ item: day }) => {
            const currentDate = getDateOfWeekDay(weekDays.indexOf(day));

            const busReservations = weeklyPreference.overrides.filter(
              (r) => getWeekDay(r.date.getDay()) === day
            );

            const morningAndGo = filterReservations(
              busReservations,
              "morning",
              "go"
            );
            const morningAndReturn = filterReservations(
              busReservations,
              "morning",
              "return"
            );
            const afternoonAndGo = filterReservations(
              busReservations,
              "afternoon",
              "go"
            );
            const afternoonAndReturn = filterReservations(
              busReservations,
              "afternoon",
              "return"
            );

            return (
              <DayCard
                key={day}
                date={currentDate}
                weekDay={day}
                onPress={() => {}}
              >
                {
                  //revisar date!!!!!!!!!!!!!!!!
                }
                <ReservationSection
                  title="Manhã"
                  goReserved={morningAndGo.length === 1}
                  returnReserved={morningAndReturn.length === 1}
                />
                <ReservationSection
                  title="Tarde"
                  goReserved={afternoonAndGo.length === 1}
                  returnReserved={afternoonAndReturn.length === 1}
                />
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
    backgroundColor: colors.lightGray,
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
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
});
