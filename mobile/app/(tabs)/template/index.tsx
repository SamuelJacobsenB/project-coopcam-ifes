import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Certifique-se de ter o pacote de ícones

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
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const { template, isLoading, error, refetch } = useTemplateByUserId();
  const { createTemplate, isPending: isCreating } = useCreateTemplate();
  const { deleteTemplate, isPending: isDeleting } = useDeleteTemplate();

  async function handleCreateTemplate() {
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
  }

  async function handleDeleteTemplate() {
    try {
      await deleteTemplate();
      await refetch();
      setIsDeleteModalVisible(false);
      showMessage("Predefinição excluída com sucesso!", "success");
    } catch {
      showMessage("Erro ao excluir predefinição", "error");
    }
  }

  // Renderização condicional do conteúdo principal
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
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Fixo */}
      <View style={styles.header}>
        <Title>Predefinição</Title>

        {template && !error && !isLoading && (
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
            {!isDeleting && (
              <Text style={styles.deleteButtonText}>Deletar</Text>
            )}
          </TouchableOpacity>
        )}
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
    paddingTop: 32, // Ajuste conforme SafeAreaView se necessário
    paddingBottom: 16,
    backgroundColor: colors.lightGray,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 60,
    flexGrow: 1, // Garante que o conteúdo ocupe a tela para centralizar loading/empty states
  },
  centerFull: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 300, // Altura mínima para evitar colapso
  },
  // Estilos do Empty State
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
    backgroundColor: colors.primary || "#007AFF", // Fallback de cor
    minWidth: 200,
  },
  btnLabel: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  // Botão de Deletar estilizado
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30", // Cor de erro padrão iOS
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
  // Lista de Cards
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
