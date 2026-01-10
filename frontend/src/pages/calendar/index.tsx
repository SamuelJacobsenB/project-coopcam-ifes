import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMessage } from "../../contexts";
import { useAllAvailableOverrides, useAllUnavailableDays } from "../../hooks";
import {
  Calendar,
  Card,
  Input,
  LoadPage,
  Navbar,
  Private,
} from "../../components";
import { isSameDate } from "../../utils";

import { DayCard } from "./components";

import styles from "./styles.module.css";

export function CalendarPage() {
  const navigate = useNavigate();

  const { showMessage } = useMessage();

  const [date, setDate] = useState(new Date());

  const {
    availableOverrides,
    isLoading: isLoadingAvailableOverrides,
    error: availableOverridesError,
    refetch: refetchAvailableOverrides,
  } = useAllAvailableOverrides();

  const {
    unavailableDays,
    isLoading: isLoadingUnavailableDays,
    error: unavailableDaysError,
    refetch: refetchUnavailableDays,
  } = useAllUnavailableDays();

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
      <Navbar />

      <main className={styles.container}>
        {/* Ações do Dia Selecionado */}
        <aside className={styles.detailsSection}>
          <Card className={styles.titleCard}>
            <h2>Agenda de Operação</h2>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--color-text-light)",
                margin: "4px 0 0",
              }}
            >
              Gerencie a disponibilidade da sua frota ou serviço
            </p>
          </Card>

          <Card className={styles.dateSelector}>
            <Input
              label="Ir para uma data específica"
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

          <DayCard
            date={date}
            unavailable={
              unavailableDays?.find((u) =>
                isSameDate(new Date(u.date), date)
              ) || null
            }
            override={
              availableOverrides?.find((o) =>
                isSameDate(new Date(o.date), date)
              ) || null
            }
            onAvailableOverrideCreated={async () => {
              await refetchAvailableOverrides();
            }}
            onUnavailableDayCreated={async () => {
              await refetchUnavailableDays();
            }}
          />
        </aside>

        {/* Seleção e Controle */}
        <section className={styles.calendarSection}>
          <Calendar
            date={date}
            setDate={setDate}
            availableOverrides={availableOverrides || []}
            unavailableDays={unavailableDays || []}
          />
        </section>
      </main>
    </Private>
  );
}
