import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";

import { useMessage } from "@/contexts";
import {
  useCreateTemplate,
  useDeleteTemplate,
  useTemplateByUserId,
} from "@/hooks";
import { ConfirmModal, DayCard, ReservationSection, Title } from "@/components";
import { weekDays } from "@/constants";
import { TemplateRequestDTO } from "@/types";
import { btnStyles, colors } from "@/styles";

export default function TemplatePage() {
  const { showMessage } = useMessage();

  const { template, isLoading, error, refetch } = useTemplateByUserId();
  const { createTemplate, isPending } = useCreateTemplate();
  const { deleteTemplate } = useDeleteTemplate();

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

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

  async function handleDeleteTemplate() {
    try {
      await deleteTemplate();
      await refetch();

      setIsDeleteModalVisible(false);

      showMessage("Predefinição excluida com sucesso!", "success");
    } catch {
      showMessage("Erro ao excluir predefinição", "error");
    }
  }

  return (
    <ScrollView style={styles.container}>
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

      {template && !error && (
        <>
          <TouchableOpacity
            style={styles.fixedBtnContainer}
            onPress={() => setIsDeleteModalVisible(true)}
          >
            <Text style={[btnStyles.btnSm, btnStyles.btnDanger]}>Deletar</Text>
          </TouchableOpacity>
          <ConfirmModal
            isOpen={isDeleteModalVisible}
            onClose={() => setIsDeleteModalVisible(false)}
            onConfirm={handleDeleteTemplate}
          />
        </>
      )}

      {template && !error && (
        <View style={styles.list}>
          {weekDays.map((day) => {
            const dayIndex = weekDays.indexOf(day);

            const morningGoReserved =
              template.go_schedule.morning_days.includes(dayIndex);
            const morningReturnReserved =
              template.return_schedule.morning_days.includes(dayIndex);
            const afternoonGoReserved =
              template.go_schedule.afternoon_days.includes(dayIndex);
            const afternoonReturnReserved =
              template.return_schedule.afternoon_days.includes(dayIndex);

            return (
              <DayCard
                key={day}
                weekDay={day}
                onPress={() => router.push(`/(tabs)/template/${dayIndex}`)}
              >
                <ReservationSection
                  title="Manhã"
                  goReserved={morningGoReserved}
                  returnReserved={morningReturnReserved}
                />
                <ReservationSection
                  title="Tarde"
                  goReserved={afternoonGoReserved}
                  returnReserved={afternoonReturnReserved}
                />
              </DayCard>
            );
          })}
        </View>
      )}
    </ScrollView>
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
  fixedBtnContainer: {
    position: "absolute",
    right: 0,
  },
  list: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 18,
    columnGap: 12,
    marginBottom: 60,
  },
});
