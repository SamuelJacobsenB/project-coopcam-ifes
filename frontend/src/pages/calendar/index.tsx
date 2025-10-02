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

        <DayCard
          date={date}
          unavailable={
            unavailableDays
              ? unavailableDays.find((unavailable) =>
                  isSameDate(new Date(unavailable.date), date)
                ) || null
              : null
          }
          override={
            availableOverrides
              ? availableOverrides.find((override) =>
                  isSameDate(new Date(override.date), date)
                ) || null
              : null
          }
          onAvailableOverrideCreated={async () => {
            await refetchAvailableOverrides();
          }}
          onUnavailableDayCreated={async () => {
            await refetchUnavailableDays();
          }}
        />
      </div>
    </Private>
  );
}
