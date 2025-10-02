import { useEffect, useReducer } from "react";

import { useMessage } from "../../../../contexts";
import {
  useDeleteAvailableOverride,
  useDeleteUnavailableDay,
} from "../../../../hooks";
import { Card, ConfirmModal, I } from "../../../../components";
import type { AvailableOverride, UnavailableDay } from "../../../../types";

import { CreateAvailableOverrideModal, CreateUnavailableDayModal } from "../";

import styles from "./styles.module.css";

interface DayCardProps {
  date: Date;
  unavailable: UnavailableDay | null;
  override: AvailableOverride | null;
  onAvailableOverrideCreated: () => Promise<void>;
  onUnavailableDayCreated: () => Promise<void>;
}

interface State {
  isPast: boolean;
  isWeekend: boolean;
  isDeleteAvailableOverrideModalOpen: boolean;
  isDeleteUnavailableDayModalOpen: boolean;
  isCreateAvailableOverrideModalOpen: boolean;
  isCreateUnavailableDayModalOpen: boolean;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  isPast: false,
  isWeekend: false,
  isDeleteAvailableOverrideModalOpen: false,
  isDeleteUnavailableDayModalOpen: false,
  isCreateAvailableOverrideModalOpen: false,
  isCreateUnavailableDayModalOpen: false,
};

export function DayCard({
  date,
  unavailable,
  override,
  onAvailableOverrideCreated,
  onUnavailableDayCreated,
}: DayCardProps) {
  const { showMessage } = useMessage();

  const { deleteAvailableOverride } = useDeleteAvailableOverride();
  const { deleteUnavailableDay } = useDeleteUnavailableDay();

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    isPast,
    isWeekend,
    isDeleteAvailableOverrideModalOpen,
    isDeleteUnavailableDayModalOpen,
    isCreateAvailableOverrideModalOpen,
    isCreateUnavailableDayModalOpen,
  } = state;

  useEffect(() => {
    dispatch({
      type: "field",
      payload: { field: "isPast", value: date < new Date() },
    });
    dispatch({
      type: "field",
      payload: {
        field: "isWeekend",
        value: date.getDay() === 0 || date.getDay() === 6,
      },
    });
  }, [date]);

  return (
    <>
      {override && (
        <ConfirmModal
          isOpen={isDeleteAvailableOverrideModalOpen}
          onClose={() =>
            dispatch({
              type: "field",
              payload: {
                field: "isDeleteAvailableOverrideModalOpen",
                value: false,
              },
            })
          }
          onConfirm={async () => {
            try {
              await deleteAvailableOverride(override.id);
              showMessage("Dia disponível excluído com sucesso", "success");
            } catch {
              showMessage("Erro ao excluir dia disponível", "error");
            }
          }}
        />
      )}
      {unavailable && (
        <ConfirmModal
          isOpen={isDeleteUnavailableDayModalOpen}
          onClose={() => {
            dispatch({
              type: "field",
              payload: {
                field: "isDeleteUnavailableDayModalOpen",
                value: false,
              },
            });
          }}
          onConfirm={async () => {
            try {
              await deleteUnavailableDay(unavailable.id);
              showMessage("Dia indisponível excluído com sucesso", "success");
            } catch {
              showMessage("Erro ao excluir dia indisponível", "error");
            }
          }}
        />
      )}
      {!override && !unavailable && (
        <>
          <CreateAvailableOverrideModal
            isOpen={isCreateAvailableOverrideModalOpen}
            onClose={() =>
              dispatch({
                type: "field",
                payload: {
                  field: "isCreateAvailableOverrideModalOpen",
                  value: false,
                },
              })
            }
            selectedDate={date}
            onCreated={onAvailableOverrideCreated}
          />
          <CreateUnavailableDayModal
            isOpen={isCreateUnavailableDayModalOpen}
            onClose={() =>
              dispatch({
                type: "field",
                payload: {
                  field: "isCreateUnavailableDayModalOpen",
                  value: false,
                },
              })
            }
            selectedDate={date}
            onCreated={onUnavailableDayCreated}
          />
        </>
      )}
      <Card className={styles.infoCard}>
        <h1 className={styles.cardTitle}>
          <I.calendar />
          <span>{date.toLocaleDateString("pt-BR")}</span>
        </h1>
        <hr />

        <ul className={styles.dateInfo}>
          <li>
            <strong>Status: </strong>
            {unavailable && "Indisponível por exceção"}
            {!unavailable &&
              !override &&
              (isWeekend || isPast) &&
              "Indisponível"}
            {override && "Disponível por exceção"}
            {!unavailable && !override && !isWeekend && !isPast && "Disponível"}
          </li>

          <li>
            <strong>Motivo: </strong>
            {isPast ? (
              "Data passada"
            ) : (
              <>
                {unavailable && unavailable.reason}
                {override && override.reason}
                {!unavailable && !override && isWeekend && "Fim de semana"}
                {!unavailable && !override && !isWeekend && "Aula normal"}
              </>
            )}
          </li>
        </ul>
        <div className={styles.buttonGroup}>
          {override && !isPast && (
            <button
              className={"btn-sm btn-danger"}
              onClick={() =>
                dispatch({
                  type: "field",
                  payload: {
                    field: "isDeleteAvailableOverrideModalOpen",
                    value: true,
                  },
                })
              }
            >
              Indisponibilizar dia
            </button>
          )}
          {unavailable && !isPast && (
            <button
              className={"btn-sm btn-info"}
              onClick={() =>
                dispatch({
                  type: "field",
                  payload: {
                    field: "isDeleteUnavailableDayModalOpen",
                    value: true,
                  },
                })
              }
            >
              Disponibilizar dia
            </button>
          )}

          {!unavailable && !override && !isWeekend && !isPast && (
            <button
              className={"btn-sm btn-danger"}
              onClick={() =>
                dispatch({
                  type: "field",
                  payload: {
                    field: "isCreateUnavailableDayModalOpen",
                    value: true,
                  },
                })
              }
            >
              Inviabilizar dia
            </button>
          )}
          {!unavailable && !override && !isPast && isWeekend && (
            <button
              className={"btn-sm btn-info"}
              onClick={() =>
                dispatch({
                  type: "field",
                  payload: {
                    field: "isCreateAvailableOverrideModalOpen",
                    value: true,
                  },
                })
              }
            >
              Viabilizar dia
            </button>
          )}
        </div>
      </Card>
    </>
  );
}
