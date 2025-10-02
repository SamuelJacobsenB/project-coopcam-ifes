import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { useMessage } from "@/contexts";
import { DayCard, ReservationSection, Title } from "@/components";
import { useCreateTemplate, useTemplateByUserId } from "@/hooks";
import { weekDays } from "@/constants";
import { TemplateRequestDTO } from "@/types";
import { btnStyles, colors } from "@/styles";

export default function TemplatePage() {
  const { showMessage } = useMessage();

  const { template, isLoading, error, refetch } = useTemplateByUserId();
  const { createTemplate, isPending } = useCreateTemplate();

  async function handleCreateTemplate() {
    if (isPending) return;

    const dto: TemplateRequestDTO = {
      go_schedule: {
        morning_days: [],
        afternoon_days: [],
      },
      return_schedule: {
        morning_days: [],
        afternoon_days: [],
      },
    };

    try {
      await createTemplate(dto);
      await refetch();

      showMessage("Predefinição criada com sucesso!", "success");
    } catch {
      showMessage("Erro ao criar predefinição", "error");
    }
  }

  return (
    <View style={styles.container}>
      <Title>Predefinição</Title>

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator color={"black"} />
        </View>
      )}

      {(error || !template) && !isLoading && (
        <>
          <Text>Predefinição não encontrada.</Text>
          <View style={styles.center}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={handleCreateTemplate}
            >
              <Text style={[btnStyles.btn, btnStyles.btnSecondary]}>
                {isPending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  "Nova predefinição"
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {template && (
        <FlatList
          contentContainerStyle={styles.list}
          data={weekDays}
          renderItem={({ item: day }) => {
            const dayIndex = weekDays.indexOf(day);

            // const morningGoReserved =
            //   template.go_schedule.morning_days.includes(dayIndex);
            // const morningReturnReserved =
            //   template.return_schedule.morning_days.includes(dayIndex);
            // const afternoonGoReserved =
            //   template.go_schedule.afternoon_days.includes(dayIndex);
            // const afternoonReturnReserved =
            //   template.return_schedule.afternoon_days.includes(dayIndex);

            return (
              <DayCard
                key={day}
                weekDay={day}
                onPress={() => router.push(`/(tabs)/template/[dayIndex]`)}
              >
                <ReservationSection
                  title="Manhã"
                  goReserved={true}
                  returnReserved={true}
                />
                <ReservationSection
                  title="Tarde"
                  goReserved={true}
                  returnReserved={true}
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
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  btnContainer: {
    width: "50%",
    marginTop: 24,
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
