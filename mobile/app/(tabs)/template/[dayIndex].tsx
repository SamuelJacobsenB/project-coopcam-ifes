import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import {
  GoBack,
  Line,
  ReservationChangeContainer,
  ReservationCheckGroup,
} from "@/components";
import { weekDays } from "@/constants";
import { useMessage } from "@/contexts";
import { useTemplate, useUpdateTemplate } from "@/hooks";
import { getErrorMessage } from "@/services";
import { colors } from "@/styles";
import { updateDays, validateWeekDay } from "@/utils";

export default function TemplateDayPage() {
  const { dayIndex } = useLocalSearchParams();
  const { showMessage } = useMessage();
  const { template, refetch } = useTemplate();
  const { updateTemplate } = useUpdateTemplate();

  const index = Number(dayIndex);
  const dayName = weekDays[index];
  const isValid = validateWeekDay(index);

  const [selections, setSelections] = useState({
    isMorningGo: false,
    isMorningReturn: false,
    isAfternoonGo: false,
    isAfternoonReturn: false,
  });

  useEffect(() => {
    if (isValid && template) {
      setSelections({
        isMorningGo: template.go_schedule.morning_days.includes(index),
        isMorningReturn: template.return_schedule.morning_days.includes(index),
        isAfternoonGo: template.go_schedule.afternoon_days.includes(index),
        isAfternoonReturn:
          template.return_schedule.afternoon_days.includes(index),
      });
    }
  }, [isValid, template, index]);

  const hasChanges =
    template &&
    (template.go_schedule.morning_days.includes(index) !==
      selections.isMorningGo ||
      template.return_schedule.morning_days.includes(index) !==
      selections.isMorningReturn ||
      template.go_schedule.afternoon_days.includes(index) !==
      selections.isAfternoonGo ||
      template.return_schedule.afternoon_days.includes(index) !==
      selections.isAfternoonReturn);

  const toggle = (field: keyof typeof selections) => {
    setSelections((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  async function handleSave() {
    if (!hasChanges || !template) return;

    const dto = {
      go_schedule: {
        morning_days: updateDays(
          template.go_schedule.morning_days,
          index,
          selections.isMorningGo,
        ),
        afternoon_days: updateDays(
          template.go_schedule.afternoon_days,
          index,
          selections.isAfternoonGo,
        ),
      },
      return_schedule: {
        morning_days: updateDays(
          template.return_schedule.morning_days,
          index,
          selections.isMorningReturn,
        ),
        afternoon_days: updateDays(
          template.return_schedule.afternoon_days,
          index,
          selections.isAfternoonReturn,
        ),
      },
    };

    try {
      await updateTemplate(dto);
      await refetch();
      showMessage("Predefinição atualizada", "success");
    } catch (err) {
      showMessage(getErrorMessage(err), "error");
    }
  }

  if (!isValid) return null;

  return (
    <View style={styles.container}>
      <GoBack path="/template" />

      <Text style={styles.title}>{dayName}</Text>
      <Line style={styles.line} />

      <View style={styles.card}>
        <ReservationCheckGroup
          title="Manhã"
          goChecked={selections.isMorningGo}
          returnChecked={selections.isMorningReturn}
          onToggleGo={() => toggle("isMorningGo")}
          onToggleReturn={() => toggle("isMorningReturn")}
        />
      </View>

      <View style={styles.card}>
        <ReservationCheckGroup
          title="Tarde"
          goChecked={selections.isAfternoonGo}
          returnChecked={selections.isAfternoonReturn}
          onToggleGo={() => toggle("isAfternoonGo")}
          onToggleReturn={() => toggle("isAfternoonReturn")}
        />
      </View>

      {hasChanges && <ReservationChangeContainer onSave={handleSave} />}
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
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#333",
    marginBottom: 8,
  },
  line: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    // Sombra para o "efeito card"
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
