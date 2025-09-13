import { useNavigate } from "react-router-dom";
import { Card, I, Navbar, Private } from "../../components";
import type { BusTrip } from "../../types";

import styles from "./styles.module.css";

export function DashboardPage() {
  const navigate = useNavigate();

  const mock: BusTrip[] = [
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
  ];

  return (
    <Private>
      <Navbar />
      <div className={styles.container}>
        <h1>Análise diária</h1>
        <ul className={styles.tripList}>
          {mock.map((mock) => (
            <li key={mock.id}>
              <Card
                className={styles.tripCard}
                onClick={() => navigate(`/viagens/${mock.id}`)}
              >
                <div className={styles.tripGraph}></div>
                <div className={styles.tripInfo}>
                  <h2>{mock.direction == "go" ? "Ida" : "Volta"}</h2>
                  <hr />
                  <small>{mock.period == "morning" ? "Manhã" : "Tarde"}</small>
                  <small>
                    <I.calendar /> {mock.date.toLocaleDateString()}
                  </small>
                  <small>
                    Status:{" "}
                    {mock.status == "unstarted"
                      ? "Não iniciado"
                      : mock.status == "started"
                      ? "Iniciado"
                      : "Terminado"}
                  </small>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </Private>
  );
}
