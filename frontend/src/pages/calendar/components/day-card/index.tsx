import { useEffect, useState } from "react";

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

  useEffect(() => {
    setIsPast(date.getTime() < new Date().getTime());
    setIsWeekend(date.getDay() === 0 || date.getDay() === 6);
  }, [date]);

  return (
    <>
      {override && (
        <ConfirmModal
          isOpen={isDeleteAvailableOverrideModalOpen}
          onClose={() => setIsDeleteAvailableOverrideModalOpen(false)}
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
          onClose={() => setIsDeleteUnavailableDayModalOpen(false)}
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
            onClose={() => setIsCreateAvailableOverrideModalOpen(false)}
            selectedDate={date}
            onCreated={onAvailableOverrideCreated}
          />
          <CreateUnavailableDayModal
            isOpen={isCreateUnavailableDayModalOpen}
            onClose={() => setIsCreateUnavailableDayModalOpen(false)}
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
              onClick={() => setIsDeleteAvailableOverrideModalOpen(true)}
            >
              Indisponibilizar dia
            </button>
          )}
          {unavailable && !isPast && (
            <button
              className={"btn-sm btn-info"}
              onClick={() => setIsDeleteUnavailableDayModalOpen(true)}
            >
              Disponibilizar dia
            </button>
          )}

          {!unavailable && !override && !isWeekend && !isPast && (
            <button
              className={"btn-sm btn-danger"}
              onClick={() => setIsCreateUnavailableDayModalOpen(true)}
            >
              Inviabilizar dia
            </button>
          )}
          {!unavailable && !override && !isPast && isWeekend && (
            <button
              className={"btn-sm btn-info"}
              onClick={() => setIsCreateAvailableOverrideModalOpen(true)}
            >
              Viabilizar dia
            </button>
          )}
        </div>
      </Card>
    </>
  );
}
