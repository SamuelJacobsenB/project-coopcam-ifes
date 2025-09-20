import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, I, Navbar, Private } from "../../components";
import { useManyBusTripsByDate } from "../../hooks";
import type { BusTrip } from "../../types";

import styles from "./styles.module.css";

export function DashboardPage() {
  const navigate = useNavigate();

  const { getManyBusTripsByDate } = useManyBusTripsByDate();

  const [busTrips, setBusTrips] = useState<BusTrip[]>([]);

  useEffect(() => {
    getManyBusTripsByDate("2025-09-21").then(setBusTrips);
  }, [getManyBusTripsByDate]);

  return (
    <Private>
      <Navbar />
      <div className={styles.container}>
        <h1>Análise diária</h1>
        {busTrips.length === 0 ? (
          <Card className={styles.noTrips}>
            <h2>Nenhuma viagem encontrada</h2>
            <p>Este dia não possui nenhuma viagem agendada.</p>
          </Card>
        ) : (
          <ul className={styles.tripList}>
            {busTrips.map((busTrip) => (
              <li key={busTrip.id}>
                <Card
                  className={styles.tripCard}
                  onClick={() => navigate(`/viagens/${busTrip.id}`)}
                >
                  <div className={styles.tripGraph}></div>
                  <div className={styles.tripInfo}>
                    <h2>{busTrip.direction == "go" ? "Ida" : "Volta"}</h2>
                    <hr />
                    <small>
                      {busTrip.period == "morning" ? "Manhã" : "Tarde"}
                    </small>
                    <small>
                      <I.calendar /> {new Date(busTrip.date).toLocaleDateString()}
                    </small>
                    <small>
                      Status:{" "}
                      {busTrip.status == "unstarted"
                        ? "Não iniciado"
                        : busTrip.status == "started"
                        ? "Iniciado"
                        : "Terminado"}
                    </small>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Private>
  );
}
