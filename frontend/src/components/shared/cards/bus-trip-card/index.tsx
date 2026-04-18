import { C } from "../../../graph";
import { DirectionBadge } from "../../badges";
import { Card } from "../card";

import type { BusReservation, BusTrip, BusTripReport } from "../../../../types";

import styles from "./styles.module.css";

interface BusTripCardProps {
  busTrip: BusTrip;
  reports: BusTripReport[];
  reservations: BusReservation[];
  onClick: () => void;
}

export function BusTripCard({
  busTrip,
  reports,
  reservations,
  onClick,
}: BusTripCardProps) {
  const { direction, status, period } = busTrip;
  const hasReports = reports.length > 0;

  const stats = reports.reduce(
    (acc, r) => {
      if (r.marked && r.attended) acc.presente++;
      else if (r.marked && !r.attended) acc.falta++;
      else if (!r.marked && r.attended) acc.extra++;
      return acc;
    },
    { presente: 0, falta: 0, extra: 0 },
  );

  const statusMap = {
    finished: "Finalizada",
    started: "Em andamento",
    unstarted: "Aguardando início",
  };

  return (
    <Card className={styles.tripCard} onClick={onClick} variant="elevated">
      <div className={styles.tripGraph}>
        <C.pizza
          data={{
            labels: hasReports ? ["Presente", "Falta", "Extra"] : ["Reservas"],
            datasets: [
              {
                data: hasReports
                  ? [stats.presente, stats.falta, stats.extra]
                  : [reservations.length || 1],
                backgroundColor: hasReports
                  ? ["#10b981", "#f59e0b", "#ef4444"]
                  : ["#6366f1"],
                borderWidth: 0,
                label: "",
              },
            ],
          }}
          labelDisplay={false}
        />
      </div>

      <div className={styles.tripInfo}>
        <div className={styles.tripStatusRow}>
          <DirectionBadge direction={direction} />
          <span className={`${styles.statusDot} ${styles[status]}`} />
        </div>

        <div className={styles.tripDetails}>
          <p>
            <strong>{period === "morning" ? "Manhã" : "Tarde"}</strong>
          </p>
          <span>
            {hasReports
              ? `${reports.length} ${reports.length > 1 ? "Relatórios" : "Relatório"}`
              : `${reservations.length} ${reservations.length > 1 ? "Reservas" : "Reserva"}`}
          </span>
          <span className={styles.statusLabel}>{statusMap[status]}</span>
        </div>
      </div>
    </Card>
  );
}
