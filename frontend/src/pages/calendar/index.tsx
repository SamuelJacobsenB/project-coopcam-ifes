import { useState } from "react";

import { Calendar, Card, I, Input, Navbar, Private } from "../../components";

import styles from "./styles.module.css";

export function CalendarPage() {
  const [date, setDate] = useState(new Date());

  const availableOverrides = [
    {
      created_at: new Date("2025-09-12T08:00:00"),
      updated_at: new Date("2025-09-12T08:00:00"),
      id: "1",
      date: new Date("2025-09-20T08:00:00"),
      reason: "Teste",
    },
  ];

  const unavailablesDays = [
    {
      created_at: new Date("2025-09-12T08:00:00"),
      updated_at: new Date("2025-09-12T08:00:00"),
      id: "1",
      date: new Date("2025-09-19T08:00:00"),
      reason: "Teste",
    },
  ];

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
            availableOverrides={availableOverrides}
            unavailableDays={unavailablesDays}
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

              const isUnavailable = unavailablesDays.some(
                (d) =>
                  new Date(d.date).toDateString() === selected.toDateString()
              );

              const override = availableOverrides.find(
                (o) =>
                  new Date(o.date).toDateString() === selected.toDateString()
              );

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
                      {
                        unavailablesDays.find(
                          (d) =>
                            new Date(d.date).toDateString() ===
                            selected.toDateString()
                        )?.reason
                      }
                      {isUnavailable && isPast && " e "}
                      {isPast && "Data passada"}
                    </li>
                  )}
                </>
              );
            })()}
          </ul>
        </Card>
      </div>
    </Private>
  );
}
