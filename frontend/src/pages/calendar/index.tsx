import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Calendar,
  Card,
  Input,
  LoadPage,
  Navbar,
  Private,
} from "../../components";
import { useMessage } from "../../contexts";
import { useAllAvailableOverrides, useAllUnavailableDays } from "../../hooks";
import { isSameDate } from "../../utils";

import { DayCard } from "./components";
import styles from "./styles.module.css";

// Helpers para manipulação de data sem bugs de fuso horário local
const formatDateForInput = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseInputDate = (dateString: string) => {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d, 12); // Meio-dia para evitar problemas de borda de fuso
};

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

  // Memoização dos dados do dia selecionado para performance
  const dayStatus = useMemo(() => {
    return {
      unavailable:
        unavailableDays?.find((u) => isSameDate(new Date(u.date), date)) ||
        null,
      override:
        availableOverrides?.find((o) => isSameDate(new Date(o.date), date)) ||
        null,
    };
  }, [date, unavailableDays, availableOverrides]);

  if (isLoadingAvailableOverrides || isLoadingUnavailableDays) {
    return <LoadPage />;
  }

  if (availableOverridesError || unavailableDaysError) {
    showMessage(
      "Erro ao carregar os dados. Tente novamente mais tarde.",
      "error",
    );
    navigate("/");
    return <LoadPage />;
  }

  return (
    <Private>
      <Navbar />

      <main className={styles.container}>
        <aside className={styles.detailsSection}>
          <Card className={styles.titleCard}>
            <h2>Agenda de Operação</h2>
            <p className={styles.subtitle}>
              Gerencie a disponibilidade da sua frota ou serviço
            </p>
          </Card>

          <Card className={styles.dateSelector}>
            <Input
              label="Ir para uma data específica"
              type="date"
              value={formatDateForInput(date)}
              onChange={(e) => setDate(parseInputDate(e.target.value))}
            />
          </Card>

          <DayCard
            date={date}
            unavailable={dayStatus.unavailable}
            override={dayStatus.override}
            onAvailableOverrideCreated={async () => {
              await refetchAvailableOverrides();
            }}
            onUnavailableDayCreated={async () => {
              await refetchUnavailableDays();
            }}
          />
        </aside>

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
