import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMessage } from "../../contexts";
import { useAllAvailableOverrides, useAllUnavailableDays } from "../../hooks";
import {
  Calendar,
  Card,
  ConfirmModal,
  I,
  Input,
  LoadPage,
  Navbar,
  Private,
} from "../../components";

import {
  CreateAvailableOverrideModal,
  CreateUnavailableDayModal,
} from "./components";

import styles from "./styles.module.css";

export function CalendarPage() {
  const navigate = useNavigate();

  const { showMessage } = useMessage();

  const [date, setDate] = useState(new Date());

  const {
    availableOverrides,
    isLoading: isLoadingAvailableOverrides,
    error: availableOverridesError,
  } = useAllAvailableOverrides();

  const {
    unavailableDays,
    isLoading: isLoadingUnavailableDays,
    error: unavailableDaysError,
  } = useAllUnavailableDays();

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

  if (isLoadingAvailableOverrides || isLoadingUnavailableDays)
    return <LoadPage />;

  if (availableOverridesError || unavailableDaysError) {
    showMessage(
      "Erro ao carregar os dados. Tente novamente mais tarde.",
      "error"
    );
    navigate("/");

    return <LoadPage />;
  }

  return (
    <Private>
      <ConfirmModal
        isOpen={isDeleteAvailableOverrideModalOpen}
        onClose={() => setIsDeleteAvailableOverrideModalOpen(false)}
        onConfirm={async () => window.alert("Deletado")}
      />
      <ConfirmModal
        isOpen={isDeleteUnavailableDayModalOpen}
        onClose={() => setIsDeleteUnavailableDayModalOpen(false)}
        onConfirm={async () => window.alert("Deletado")}
      />
      <CreateAvailableOverrideModal
        isOpen={isCreateAvailableOverrideModalOpen}
        onClose={() => setIsCreateAvailableOverrideModalOpen(false)}
        selectedDate={date}
      />
      <CreateUnavailableDayModal
        isOpen={isCreateUnavailableDayModalOpen}
        onClose={() => setIsCreateUnavailableDayModalOpen(false)}
        selectedDate={date}
      />
      <Navbar />
      <div className={styles.container}>
        <section className={styles.calendarSection}>
          <Card>
            <h2>Selecione uma data</h2>
          </Card>
          <Calendar
            date={date}
            setDate={setDate}
            availableOverrides={availableOverrides || []}
            unavailableDays={unavailableDays || []}
          />
          <Card>
            <Input
              label="Data"
              type="date"
              value={date.toISOString().split("T")[0]}
              onChange={(e) => {
                const [year, month, day] = e.target.value
                  .split("-")
                  .map(Number);
                const localDate = new Date(year, month - 1, day, 12);
                setDate(localDate);
              }}
            />
          </Card>
        </section>

        <Card className={styles.infoCard}>
          <h1 className={styles.cardTitle}>
            <I.calendar />
            <span>{date.toLocaleDateString("pt-BR")}</span>
          </h1>
          <hr />

          <ul className={styles.dateInfo}>
            {(() => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const selected = new Date(date);
              selected.setHours(0, 0, 0, 0);

              const isPast = selected < today;
              const isWeekend =
                selected.getDay() === 0 || selected.getDay() === 6;

              const isUnavailable = unavailableDays
                ? unavailableDays.some(
                    (d) =>
                      new Date(d.date).toDateString() ===
                      selected.toDateString()
                  )
                : false;

              const override = availableOverrides
                ? availableOverrides.find(
                    (o) =>
                      new Date(o.date).toDateString() ===
                      selected.toDateString()
                  )
                : undefined;

              return (
                <>
                  <li>
                    <strong>Status:</strong>{" "}
                    {isUnavailable
                      ? "Indisponível"
                      : override
                      ? "Disponível por exceção"
                      : isWeekend
                      ? "Final de semana"
                      : "Dia útil"}
                  </li>
                  {override && (
                    <li>
                      <strong>Motivo da exceção:</strong> {override.reason}
                    </li>
                  )}
                  {(isUnavailable || isPast) && (
                    <li>
                      <strong>Motivo da indisponibilidade:</strong>{" "}
                      {unavailableDays
                        ? unavailableDays.find(
                            (d) =>
                              new Date(d.date).toDateString() ===
                              selected.toDateString()
                          )?.reason
                        : ""}
                      {isUnavailable && isPast && " e "}
                      {isPast && "Data passada"}
                    </li>
                  )}
                </>
              );
            })()}
          </ul>
          <div className={styles.buttonGroup}>
            <button
              className={"btn-sm btn-success"}
              onClick={() => setIsCreateAvailableOverrideModalOpen(true)}
            >
              Viabilizar dia
            </button>
            <button
              className={"btn-sm btn-danger"}
              onClick={() => setIsCreateUnavailableDayModalOpen(true)}
            >
              Inviabilizar dia
            </button>
          </div>
        </Card>
      </div>
    </Private>
  );
}
