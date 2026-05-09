import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";

import {
  GoBack,
  Line,
  ReservationChangeContainer,
  ReservationCheckGroup,
} from "@/components";
import { weekDays } from "@/constants";
import { useMessage } from "@/contexts";
import {
  useCreateBusReservation,
  useDeleteBusReservation,
  useWeeklyPreferenceByUserId,
} from "@/hooks";
import { getErrorMessage } from "@/services";
import { colors } from "@/styles";
import type { BusReservation, Direction, Period } from "@/types";
import { validateWeekDay } from "@/utils";

export default function DayPreferencePage() {
  const { dayIndex } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const { showMessage } = useMessage();

  const { weeklyPreference } = useWeeklyPreferenceByUserId();
  const { createBusReservation } = useCreateBusReservation();
  const { deleteBusReservation } = useDeleteBusReservation();

  const index = Number(dayIndex);
  const dayName = weekDays[index];
  const isValid = validateWeekDay(index);

  const [selections, setSelections] = useState({
    isMorningGo: false,
    isMorningReturn: false,
    isAfternoonGo: false,
    isAfternoonReturn: false,
  });

  const [initialState, setInitialState] = useState({
    isMorningGo: false,
    isMorningReturn: false,
    isAfternoonGo: false,
    isAfternoonReturn: false,
  });

  const [existingReservations, setExistingReservations] = useState<{
    mGo?: BusReservation;
    mRet?: BusReservation;
    aGo?: BusReservation;
    aRet?: BusReservation;
  }>({});

  useEffect(() => {
    if (isValid && weeklyPreference?.overrides) {
      const getRes = (period: Period, direction: Direction) => {
        return weeklyPreference.overrides.find((r) => {
          const resDayIndex = new Date(r.date).getDay();
          return (
            resDayIndex === index &&
            r.period === period &&
            r.direction === direction
          );
        });
      };

      const mGo = getRes("morning", "go");
      const mRet = getRes("morning", "return");
      const aGo = getRes("afternoon", "go");
      const aRet = getRes("afternoon", "return");

      setExistingReservations({ mGo, mRet, aGo, aRet });

      const currentState = {
        isMorningGo: !!mGo,
        isMorningReturn: !!mRet,
        isAfternoonGo: !!aGo,
        isAfternoonReturn: !!aRet,
      };

      setSelections(currentState);
      setInitialState(currentState);
    }
  }, [isValid, weeklyPreference, index]);

  const hasChanges =
    selections.isMorningGo !== initialState.isMorningGo ||
    selections.isMorningReturn !== initialState.isMorningReturn ||
    selections.isAfternoonGo !== initialState.isAfternoonGo ||
    selections.isAfternoonReturn !== initialState.isAfternoonReturn;

  const toggle = (field: keyof typeof selections) => {
    setSelections((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const getTargetDate = () => {
    if (!weeklyPreference) return new Date();
    const targetDate = new Date(weeklyPreference.week_start);
    targetDate.setHours(12, 0, 0, 0);
    const diff = index - targetDate.getDay();
    targetDate.setDate(targetDate.getDate() + diff);
    return targetDate;
  };

  async function handleSave() {
    if (!hasChanges || !weeklyPreference) return;

    try {
      const targetDate = getTargetDate();
      const promises: Promise<void>[] = [];

      if (selections.isMorningGo && !initialState.isMorningGo) {
        promises.push(
          createBusReservation({
            date: targetDate,
            period: "morning",
            direction: "go",
          }).then(() => undefined),
        );
      } else if (
        !selections.isMorningGo &&
        initialState.isMorningGo &&
        existingReservations.mGo
      ) {
        promises.push(
          deleteBusReservation(existingReservations.mGo.id).then(
            () => undefined,
          ),
        );
      }

      if (selections.isMorningReturn && !initialState.isMorningReturn) {
        promises.push(
          createBusReservation({
            date: targetDate,
            period: "morning",
            direction: "return",
          }).then(() => undefined),
        );
      } else if (
        !selections.isMorningReturn &&
        initialState.isMorningReturn &&
        existingReservations.mRet
      ) {
        promises.push(
          deleteBusReservation(existingReservations.mRet.id).then(
            () => undefined,
          ),
        );
      }

      if (selections.isAfternoonGo && !initialState.isAfternoonGo) {
        promises.push(
          createBusReservation({
            date: targetDate,
            period: "afternoon",
            direction: "go",
          }).then(() => undefined),
        );
      } else if (
        !selections.isAfternoonGo &&
        initialState.isAfternoonGo &&
        existingReservations.aGo
      ) {
        promises.push(
          deleteBusReservation(existingReservations.aGo.id).then(
            () => undefined,
          ),
        );
      }

      if (selections.isAfternoonReturn && !initialState.isAfternoonReturn) {
        promises.push(
          createBusReservation({
            date: targetDate,
            period: "afternoon",
            direction: "return",
          }).then(() => undefined),
        );
      } else if (
        !selections.isAfternoonReturn &&
        initialState.isAfternoonReturn &&
        existingReservations.aRet
      ) {
        promises.push(
          deleteBusReservation(existingReservations.aRet.id).then(
            () => undefined,
          ),
        );
      }

      await Promise.all(promises);

      await queryClient.invalidateQueries({ queryKey: ["weekly-preference"] });

      showMessage("Preferência semanal atualizada", "success");
    } catch (err) {
      showMessage(getErrorMessage(err), "error");
    }
  }

  if (!isValid) return null;

  return (
    <View style={styles.container}>
      <GoBack path="/" />

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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});
