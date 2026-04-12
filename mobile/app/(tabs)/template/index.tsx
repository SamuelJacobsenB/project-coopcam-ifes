import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ConfirmModal, DayCard, ReservationSection, Title } from "@/components";
import { weekDays } from "@/constants";
import { useMessage } from "@/contexts";
import {
  useCreateTemplate,
  useDeleteTemplate,
  useTemplateByUserId,
} from "@/hooks";
import { btnStyles, colors } from "@/styles";
import type { TemplateRequestDTO } from "@/types";

export default function TemplatePage() {
  const { showMessage } = useMessage();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const { template, isLoading, error, refetch } = useTemplateByUserId();
  const { createTemplate, isPending: isCreating } = useCreateTemplate();
  const { deleteTemplate, isPending: isDeleting } = useDeleteTemplate();

  const handleCreateTemplate = async () => {
    if (isCreating) return;

    const dto: TemplateRequestDTO = {
      go_schedule: { morning_days: [], afternoon_days: [] },
      return_schedule: { morning_days: [], afternoon_days: [] },
    };

    try {
      await createTemplate(dto);
      await refetch();
      showMessage("Predefinição criada com sucesso!", "success");
    } catch {
      showMessage("Erro ao criar predefinição", "error");
    }
  };

  const handleDeleteTemplate = async () => {
    try {
      await deleteTemplate();
      await refetch();
      showMessage("Predefinição excluída com sucesso!", "success");
    } catch {
      showMessage("Erro ao excluir predefinição", "error");
    } finally {
      setIsDeleteModalVisible(false);
    }
  };

  const renderHeaderAction = () => {
    if (!template || error || isLoading) return null;

    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => setIsDeleteModalVisible(true)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Ionicons name="trash-outline" size={20} color="white" />
        )}
        {!isDeleting && <Text style={styles.deleteButtonText}>Deletar</Text>}
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerFull}>
          <ActivityIndicator size="large" color={colors.primary || "black"} />
        </View>
      );
    }

    if (error || !template) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="calendar-outline"
            size={64}
            color={colors.gray || "#ccc"}
          />
          <Text style={styles.emptyText}>
            Você ainda não possui uma predefinição de horários.
          </Text>
          <TouchableOpacity
            style={[styles.btnContainer, btnStyles.btnPrimary]}
            onPress={handleCreateTemplate}
            disabled={isCreating}
          >
            {isCreating ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.btnLabel}>Criar nova predefinição</Text>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.list}>
        {weekDays.map((day, dayIndex) => {
          const { go_schedule, return_schedule } = template;

          const morningGoReserved = go_schedule.morning_days.includes(dayIndex);
          const morningReturnReserved =
            return_schedule.morning_days.includes(dayIndex);
          const afternoonGoReserved =
            go_schedule.afternoon_days.includes(dayIndex);
          const afternoonReturnReserved =
            return_schedule.afternoon_days.includes(dayIndex);

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
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title>Predefinição</Title>
        {renderHeaderAction()}
      </View>

      <View style={styles.content}>{renderContent()}</View>

      <ConfirmModal
        isOpen={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        onConfirm={handleDeleteTemplate}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  header: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
    backgroundColor: colors.lightGray,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 60,
    flexGrow: 1,
  },
  centerFull: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 300,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
    maxWidth: "80%",
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: colors.primary || "#007AFF",
    minWidth: 200,
  },
  btnLabel: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
