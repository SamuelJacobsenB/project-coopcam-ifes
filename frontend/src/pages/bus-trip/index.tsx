import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useBusTripById, useManyBusTripsByDate } from "../../hooks";
import {
  Card,
  DateInput,
  DualPage,
  I,
  Navbar,
  Private,
} from "../../components";
import { isSameDate, parseDateInput } from "../../utils";
import type { BusTrip } from "../../types";

import styles from "./styles.module.css";

export function BusTripPage() {
  const { id } = useParams();

  const { getBusTripById } = useBusTripById();
  const { getManyBusTripsByDate } = useManyBusTripsByDate();

  const [date, setDate] = useState(new Date());
  const [trips, setTrips] = useState<BusTrip[]>([]);

  const [selectedTrip, setSelectedTrip] = useState<BusTrip | null>(null);

  useEffect(() => {
    if (id) getBusTripById(id).then((trip) => setSelectedTrip(trip));
  }, [id, trips, getBusTripById]);

  useEffect(() => {
    getManyBusTripsByDate(date.toISOString().split("T")[0]).then(setTrips);
  }, [date, getManyBusTripsByDate]);

  return (
    <Private>
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
                .filter((trip) => isSameDate(new Date(trip.date), date))
                .map((trip) => (
                  <li key={trip.id}>
                    <Card
                      className={`${styles.tripItem} ${
                        selectedTrip?.id === trip.id && styles.selectedTrip
                      }`}
                      onClick={() => setSelectedTrip(trip)}
                    >
                      <I.calendar />
                      <h5>{new Date(trip.date).toLocaleDateString()}</h5>
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
                      <I.calendar /> {new Date(selectedTrip.date).toLocaleDateString()}
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
    </Private>
  );
}
