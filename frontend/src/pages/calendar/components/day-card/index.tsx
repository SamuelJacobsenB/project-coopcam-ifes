import { useCallback, useEffect, useReducer } from "react";

import { Card, ConfirmModal, I } from "../../../../components";
import { useMessage } from "../../../../contexts";
import {
  useDeleteAvailableOverride,
  useDeleteUnavailableDay,
} from "../../../../hooks";
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

type Action = {
  type: "field";
  payload: { field: keyof State; value: boolean };
};

const reducer = (state: State, action: Action): State => {
  if (action.type === "field") {
    return { ...state, [action.payload.field]: action.payload.value };
  }
  return state;
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
  const [state, dispatch] = useReducer(reducer, initialState);
  const { showMessage } = useMessage();
  const { deleteAvailableOverride } = useDeleteAvailableOverride();
  const { deleteUnavailableDay } = useDeleteUnavailableDay();

  const currentReason = override?.reason || unavailable?.reason;

  const setModal = useCallback((field: keyof State, value: boolean) => {
    dispatch({ type: "field", payload: { field, value } });
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    const day = date.getDay();
    dispatch({
      type: "field",
      payload: { field: "isPast", value: compareDate < today },
    });
    dispatch({
      type: "field",
      payload: { field: "isWeekend", value: day === 0 || day === 6 },
    });
  }, [date]);

  const handleDeleteOverride = async () => {
    if (!override) return;
    try {
      await deleteAvailableOverride(override.id);
      await onAvailableOverrideCreated();
      showMessage("Exceção removida com sucesso", "success");
    } catch {
      showMessage("Erro ao remover exceção", "error");
    }
  };

  const handleDeleteUnavailable = async () => {
    if (!unavailable) return;
    try {
      await deleteUnavailableDay(unavailable.id);
      await onUnavailableDayCreated();
      showMessage("Dia liberado com sucesso", "success");
    } catch {
      showMessage("Erro ao liberar dia", "error");
    }
  };

  const statusClass = override
    ? styles.statusAvailable
    : unavailable || state.isWeekend
      ? styles.statusUnavailable
      : styles.statusAvailable;

  const statusText = override
    ? "Disponível (Exceção)"
    : unavailable || state.isWeekend
      ? "Indisponível"
      : "Disponível";

  return (
    <>
      <Card className={styles.infoCard}>
        <div className={styles.headerContainer}>
          <div className={styles.cardTitle}>
            <I.calendar size={20} />
            <h2>
              {date.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </h2>
          </div>
          <div className={styles.badgeWrapper}>
            <span className={`${styles.statusBadge} ${statusClass}`}>
              {statusText}
            </span>
            {currentReason && (
              <p className={styles.reasonText}>
                <strong>Motivo:</strong> {currentReason}
              </p>
            )}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          {!state.isPast ? (
            <>
              {override && (
                <button
                  className={styles.btnActionOutline}
                  onClick={() =>
                    setModal("isDeleteAvailableOverrideModalOpen", true)
                  }
                >
                  Remover Exceção
                </button>
              )}
              {unavailable && (
                <button
                  className={styles.btnActionPrimary}
                  onClick={() =>
                    setModal("isDeleteUnavailableDayModalOpen", true)
                  }
                >
                  Liberar Dia
                </button>
              )}
              {!unavailable && !override && !state.isWeekend && (
                <button
                  className={styles.btnActionOutline}
                  onClick={() =>
                    setModal("isCreateUnavailableDayModalOpen", true)
                  }
                >
                  Bloquear Dia
                </button>
              )}
              {!unavailable && !override && state.isWeekend && (
                <button
                  className={styles.btnActionPrimary}
                  onClick={() =>
                    setModal("isCreateAvailableOverrideModalOpen", true)
                  }
                >
                  Abrir Exceção
                </button>
              )}
            </>
          ) : (
            <span className={styles.pastDateWarning}>Encerrado</span>
          )}
        </div>
      </Card>

      <ConfirmModal
        isOpen={state.isDeleteAvailableOverrideModalOpen}
        onClose={() => setModal("isDeleteAvailableOverrideModalOpen", false)}
        onConfirm={handleDeleteOverride}
      />
      <ConfirmModal
        isOpen={state.isDeleteUnavailableDayModalOpen}
        onClose={() => setModal("isDeleteUnavailableDayModalOpen", false)}
        onConfirm={handleDeleteUnavailable}
      />
      <CreateAvailableOverrideModal
        selectedDate={date}
        isOpen={state.isCreateAvailableOverrideModalOpen}
        onClose={() => setModal("isCreateAvailableOverrideModalOpen", false)}
        onCreated={onAvailableOverrideCreated}
      />
      <CreateUnavailableDayModal
        selectedDate={date}
        isOpen={state.isCreateUnavailableDayModalOpen}
        onClose={() => setModal("isCreateUnavailableDayModalOpen", false)}
        onCreated={onUnavailableDayCreated}
      />
    </>
  );
}
