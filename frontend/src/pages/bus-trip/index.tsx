import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Card, DateInput, DualPage, I, Navbar } from "../../components";
import { isSameDate, parseDateInput } from "../../utils";
import type { BusTrip } from "../../types";

import styles from "./styles.module.css";

export function BusTripPage() {
  const { id } = useParams();

  const [date, setDate] = useState(new Date());
  const [trips, setTrips] = useState<BusTrip[]>([
    {
      id: "trip-001",
      date: new Date("2025-09-12T08:00:00"),
      period: "morning",
      direction: "go",
      status: "finished",
      created_at: new Date("2025-09-10T10:15:00"),
      updated_at: new Date("2025-09-12T09:30:00"),
    },
    {
      id: "trip-002",
      date: new Date("2025-09-12T18:30:00"),
      period: "morning",
      direction: "return",
      status: "finished",
      created_at: new Date("2025-09-11T14:45:00"),
      updated_at: new Date("2025-09-13T17:00:00"),
    },
    {
      id: "trip-003",
      date: new Date("2025-09-12T13:00:00"),
      period: "afternoon",
      direction: "go",
      status: "started",
      created_at: new Date("2025-09-12T08:20:00"),
      updated_at: new Date("2025-09-14T16:10:00"),
    },
    {
      id: "trip-004",
      date: new Date("2025-09-12T22:00:00"),
      period: "afternoon",
      direction: "return",
      status: "unstarted",
      created_at: new Date("2025-09-13T11:00:00"),
      updated_at: new Date("2025-09-16T23:30:00"),
    },
  ]);

  const [selectedTrip, setSelectedTrip] = useState<BusTrip | null>(null);

  useEffect(() => {
    if (id) {
      setSelectedTrip(trips.find((trip) => trip.id === id) || null);
    }
  }, [id, trips]);

  return (
    <>
      <Navbar />
      <DualPage
        leftSide={
          <>
            <section className={styles.header}>
              <h1>Viagens</h1>
              <p>Pesquise por viagens</p>
            </section>
            <DateInput
              value={date.toISOString().split("T")[0]}
              onChange={(e) => {
                setDate(parseDateInput(e.target.value));
              }}
              placeholder="Buscar viagens..."
            />
            <ul className={styles.tripList}>
              {trips
                .filter((trip) => isSameDate(trip.date, date))
                .map((trip) => (
                  <li key={trip.id}>
                    <Card
                      className={`${styles.tripItem} ${
                        selectedTrip?.id === trip.id && styles.selectedTrip
                      }`}
                      onClick={() => setSelectedTrip(trip)}
                    >
                      <I.calendar />
                      <h5>{trip.date.toLocaleDateString()}</h5>
                    </Card>
                  </li>
                ))}
            </ul>
          </>
        }
        rightSide={
          <>
            {selectedTrip ? (
              <>
                <Card className={styles.selectedTripBox}>
                  <div className={styles.tripGraph}></div>
                  <div className={styles.tripInfo}>
                    <h1>{selectedTrip.direction == "go" ? "Ida" : "Volta"}</h1>
                    <hr />
                    <small>
                      {selectedTrip.period == "morning" ? "Manhã" : "Tarde"}
                    </small>
                    <small>
                      <I.calendar /> {selectedTrip.date.toLocaleDateString()}
                    </small>
                    <small>
                      Status:{" "}
                      {selectedTrip.status == "unstarted"
                        ? "Não iniciado"
                        : selectedTrip.status == "started"
                        ? "Iniciado"
                        : "Terminado"}
                    </small>
                  </div>
                </Card>
              </>
            ) : (
              <Card className={styles.nonSelectedTripBox}>
                <h1>Selecione uma viagem</h1>
                <p>Selecione uma viagem para ver mais detalhes sobre esta.</p>
              </Card>
            )}
          </>
        }
        leftClassName={styles.left}
      />
    </>
  );
}
