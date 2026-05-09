import { useEffect, useState } from "react";

import { Card, ConfirmModal, I } from "../../../../components";
import { useMessage } from "../../../../contexts";
import {
  useDeleteAvailableOverride,
  useDeleteUnavailableDay,
} from "../../../../hooks";
import { getErrorMessage } from "../../../../services";
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

  const [isPast, setIsPast] = useState(false);
  const [isWeekend, setIsWeekend] = useState(false);

  const [
    isDeleteAvailableOverrideModalOpen,
    setIsDeleteAvailableOverrideModalOpen,
  ] = useState(false);
  const [isDeleteUnavailableDayModalOpen, setIsDeleteUnavailableDayModalOpen] =
    useState(false);
  const [
    isCreateAvailableOverrideModalOpen,
    setIsCreateAvailableOverrideModalOpen,
  ] = useState(false);
  const [isCreateUnavailableDayModalOpen, setIsCreateUnavailableDayModalOpen] =
    useState(false);

  const currentReason = override?.reason || unavailable?.reason;

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    const day = date.getDay();

    setIsPast(compareDate < today);
    setIsWeekend(day === 0 || day === 6);
  }, [date]);

  const handleDeleteOverride = async () => {
    if (!override) return;
    try {
      await deleteAvailableOverride(override.id);
      await onAvailableOverrideCreated();
      showMessage("Exceção removida com sucesso", "success");
      setIsDeleteAvailableOverrideModalOpen(false);
    } catch (err) {
      showMessage(getErrorMessage(err), "error");
    }
  };

  const handleDeleteUnavailable = async () => {
    if (!unavailable) return;
    try {
      await deleteUnavailableDay(unavailable.id);
      await onUnavailableDayCreated();
      showMessage("Dia liberado com sucesso", "success");
      setIsDeleteUnavailableDayModalOpen(false);
    } catch (err) {
      showMessage(getErrorMessage(err), "error");
    }
  };

  const statusClass = override
    ? styles.statusAvailable
    : unavailable || isWeekend
      ? styles.statusUnavailable
      : styles.statusAvailable;

  const statusText = override
    ? "Disponível (Exceção)"
    : unavailable || isWeekend
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
          {!isPast ? (
            <>
              {override && (
                <button
                  className={styles.btnActionOutline}
                  onClick={() => setIsDeleteAvailableOverrideModalOpen(true)}
                >
                  Remover Exceção
                </button>
              )}
              {unavailable && (
                <button
                  className={styles.btnActionPrimary}
                  onClick={() => setIsDeleteUnavailableDayModalOpen(true)}
                >
                  Liberar Dia
                </button>
              )}
              {!unavailable && !override && !isWeekend && (
                <button
                  className={styles.btnActionOutline}
                  onClick={() => setIsCreateUnavailableDayModalOpen(true)}
                >
                  Bloquear Dia
                </button>
              )}
              {!unavailable && !override && isWeekend && (
                <button
                  className={styles.btnActionPrimary}
                  onClick={() => setIsCreateAvailableOverrideModalOpen(true)}
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
        isOpen={isDeleteAvailableOverrideModalOpen}
        onClose={() => setIsDeleteAvailableOverrideModalOpen(false)}
        onConfirm={handleDeleteOverride}
      />
      <ConfirmModal
        isOpen={isDeleteUnavailableDayModalOpen}
        onClose={() => setIsDeleteUnavailableDayModalOpen(false)}
        onConfirm={handleDeleteUnavailable}
      />
      <CreateAvailableOverrideModal
        selectedDate={date}
        isOpen={isCreateAvailableOverrideModalOpen}
        onClose={() => setIsCreateAvailableOverrideModalOpen(false)}
        onCreated={onAvailableOverrideCreated}
      />
      <CreateUnavailableDayModal
        selectedDate={date}
        isOpen={isCreateUnavailableDayModalOpen}
        onClose={() => setIsCreateUnavailableDayModalOpen(false)}
        onCreated={onUnavailableDayCreated}
      />
    </>
  );
}
