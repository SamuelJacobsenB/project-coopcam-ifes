import { useMemo } from "react";

import { C, Card, I } from "../../../../components";
import type { BusTrip, BusTripReport, Status } from "../../../../types";

import { TripStatusControl } from "../trip-status-control";

import styles from "./styles.module.css";

interface SelectedBusTripCardProps {
  selectedTrip: BusTrip;
  reservationsLength: number;
  reports: BusTripReport[];
  onStatusUpdated: (status: Status) => void;
}

export function SelectedBusTripCard({
  selectedTrip,
  reservationsLength,
  reports,
  onStatusUpdated,
}: SelectedBusTripCardProps) {
  const stats = useMemo(() => {
    if (reports.length === 0) return null;
    return {
      presente: reports.filter((r) => r.marked && r.attended).length,
      falta: reports.filter((r) => r.marked && !r.attended).length,
      extra: reports.filter((r) => !r.marked && r.attended).length,
    };
  }, [reports]);

  const chartData = useMemo(
    () => ({
      labels: stats ? ["Presente", "Falta", "Extra"] : ["Reservas"],
      datasets: [
        {
          data: stats
            ? [stats.presente, stats.falta, stats.extra]
            : [reservationsLength || 0],
          backgroundColor: stats
            ? ["#10b981", "#f59e0b", "#ef4444"]
            : ["#6366f1"],
          borderWidth: 0,
          label: "",
        },
      ],
    }),
    [stats, reservationsLength],
  );

  return (
    <Card className={styles.cardContainer}>
      <div className={styles.contentGrid}>
        <div className={styles.chartWrapper}>
          <C.pizza data={chartData} labelDisplay={true} />
        </div>

        <div className={styles.tripInfo}>
          <div>
            <div className={styles.header}>
              <span className={styles.subTitle}>
                {selectedTrip.period === "morning"
                  ? "Turno da Manhã"
                  : "Turno da Tarde"}
              </span>
              <h1 className={styles.directionTitle}>
                {selectedTrip.direction === "go" ? "Ida" : "Volta"}
              </h1>
            </div>

            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <I.calendar size={14} />
                {new Date(selectedTrip.date).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })}
              </div>
              <div className={styles.metaItem}>
                {reservationsLength === 0
                  ? "Nenhuma reserva"
                  : `${reservationsLength} ${reservationsLength === 1 ? "reserva" : "reservas"}`}
              </div>
              <div
                className={`${styles.metaItem} ${selectedTrip.period === "morning" ? styles.morning : styles.afternoon}`}
              >
                {selectedTrip.period === "morning" ? (
                  <>
                    <I.sun size={14} /> Manhã
                  </>
                ) : (
                  <>
                    <I.moon size={14} /> Tarde
                  </>
                )}
              </div>
            </div>
          </div>

          <TripStatusControl
            trip={selectedTrip}
            onStatusUpdated={onStatusUpdated}
          />
        </div>
      </div>
    </Card>
  );
}
