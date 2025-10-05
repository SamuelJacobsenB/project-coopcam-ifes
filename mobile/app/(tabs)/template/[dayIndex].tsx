import React, { useEffect, useReducer } from "react";
import { View, Text, StyleSheet } from "react-native";

import { useLocalSearchParams } from "expo-router";

import { GoBack, Line, ReservationCheckGroup } from "@/components";
import { weekDays } from "@/constants";
import { updateDays, validateWeekDay } from "@/utils";
import { colors } from "@/styles";
import { useTemplateByUserId, useUpdateTemplate } from "@/hooks";
import { ReservationChangeContainer } from "@/components/shared/reservation-change-container";
import { TemplateUpdateDTO } from "@/types";
import { useMessage } from "@/contexts";

interface State {
  isMorningGoReserved: boolean;
  isMorningReturnReserved: boolean;
  isAfternoonGoReserved: boolean;
  isAfternoonReturnReserved: boolean;
}
const reducer = (state: State, action: any) => {
  switch (action.type) {
    case "field":
      return {
        ...state,
        [action.payload.field as string]: action.payload.value,
      };
    default:
      return state;
  }
};
const initialState: State = {
  isMorningGoReserved: false,
  isMorningReturnReserved: false,
  isAfternoonGoReserved: false,
  isAfternoonReturnReserved: false,
};

export default function TemplateDayPage() {
  const { dayIndex } = useLocalSearchParams();

  const { showMessage } = useMessage();

  const { template, refetch } = useTemplateByUserId();
  const { updateTemplate } = useUpdateTemplate();

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    isMorningGoReserved,
    isMorningReturnReserved,
    isAfternoonGoReserved,
    isAfternoonReturnReserved,
  } = state;

  const index = Number(dayIndex);
  const dayName = weekDays[index];
  const isValid = validateWeekDay(index);

  // Verifica se está diferente do original
  const changed =
    template &&
    (template.go_schedule.morning_days.includes(index) !==
      isMorningGoReserved ||
      template.return_schedule.morning_days.includes(index) !==
        isMorningReturnReserved ||
      template.go_schedule.afternoon_days.includes(index) !==
        isAfternoonGoReserved ||
      template.return_schedule.afternoon_days.includes(index) !==
        isAfternoonReturnReserved);

  async function handleSave() {
    if (changed) {
      const dto: TemplateUpdateDTO = {
        go_schedule: {
          morning_days: updateDays(
            template.go_schedule.morning_days,
            index,
            isMorningGoReserved
          ),
          afternoon_days: updateDays(
            template.go_schedule.afternoon_days,
            index,
            isAfternoonGoReserved
          ),
        },
        return_schedule: {
          morning_days: updateDays(
            template.return_schedule.morning_days,
            index,
            isMorningReturnReserved
          ),
          afternoon_days: updateDays(
            template.return_schedule.afternoon_days,
            index,
            isAfternoonReturnReserved
          ),
        },
      };

      try {
        await updateTemplate(dto);
        await refetch();

        dispatch({
          type: "field",
          payload: {
            field: "changed",
            value: false,
          },
        });

        showMessage("Predefinição atualizada com sucesso!", "success");
      } catch {
        showMessage("Erro ao atualizar predefinição", "error");
      }
    }
  }

  useEffect(() => {
    if (isValid && template) {
      dispatch({
        type: "field",
        payload: {
          field: "isMorningGoReserved",
          value: template.go_schedule.morning_days.includes(index),
        },
      });
      dispatch({
        type: "field",
        payload: {
          field: "isMorningReturnReserved",
          value: template.return_schedule.morning_days.includes(index),
        },
      });
      dispatch({
        type: "field",
        payload: {
          field: "isAfternoonGoReserved",
          value: template.go_schedule.afternoon_days.includes(index),
        },
      });
      dispatch({
        type: "field",
        payload: {
          field: "isAfternoonReturnReserved",
          value: template.return_schedule.afternoon_days.includes(index),
        },
      });
    }
  }, [isValid, template, index]);

  return (
    <View style={styles.container}>
      <GoBack path="/template" />

      {isValid && (
        <>
          <Text style={styles.title}>{dayName}</Text>
          <Line style={styles.line} />
          <ReservationCheckGroup
            title="Manhã"
            goChecked={isMorningGoReserved}
            returnChecked={isMorningReturnReserved}
            onToggleGo={() =>
              dispatch({
                type: "field",
                payload: {
                  field: "isMorningGoReserved",
                  value: !isMorningGoReserved,
                },
              })
            }
            onToggleReturn={() =>
              dispatch({
                type: "field",
                payload: {
                  field: "isMorningReturnReserved",
                  value: !isMorningReturnReserved,
                },
              })
            }
          />

          <ReservationCheckGroup
            title="Tarde"
            goChecked={isAfternoonGoReserved}
            returnChecked={isAfternoonReturnReserved}
            onToggleGo={() =>
              dispatch({
                type: "field",
                payload: {
                  field: "isAfternoonGoReserved",
                  value: !isAfternoonGoReserved,
                },
              })
            }
            onToggleReturn={() =>
              dispatch({
                type: "field",
                payload: {
                  field: "isAfternoonReturnReserved",
                  value: !isAfternoonReturnReserved,
                },
              })
            }
          />

          {changed && <ReservationChangeContainer onSave={handleSave} />}
        </>
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
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    marginBottom: 8,
  },
  line: {
    marginBottom: 24,
  },
});
