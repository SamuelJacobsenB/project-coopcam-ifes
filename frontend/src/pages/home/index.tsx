import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  BusTripCard,
  Card,
  I,
  LoadPage,
  Navbar,
  Private,
} from "../../components";
import {
  useManyBusReservationsByDate,
  useManyBusTripReportsByDate,
  useManyBusTripsByDate,
} from "../../hooks";
import type { BusTrip } from "../../types";

import styles from "./styles.module.css";

export function DashboardPage() {
  const navigate = useNavigate();

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const { trips, isLoading: tripsLoading } = useManyBusTripsByDate(today);
  const { reports, isLoading: reportsLoading } =
    useManyBusTripReportsByDate(today);
  const { reservations, isLoading: reservationsLoading } =
    useManyBusReservationsByDate(today);

  const isLoading = tripsLoading || reportsLoading || reservationsLoading;

  const tripReportsMap = useMemo(
    () =>
      reports.reduce(
        (acc, report) => {
          if (!acc[report.bus_trip_id]) {
            acc[report.bus_trip_id] = [];
          }
          acc[report.bus_trip_id].push(report);
          return acc;
        },
        {} as Record<string, typeof reports>,
      ),
    [reports],
  );

  const tripReservationsMap = useMemo(
    () =>
      reservations.reduce(
        (acc, reservation) => {
          if (!acc[reservation.bus_trip_id]) {
            acc[reservation.bus_trip_id] = [];
          }
          acc[reservation.bus_trip_id].push(reservation);
          return acc;
        },
        {} as Record<string, typeof reservations>,
      ),
    [reservations],
  );

  if (isLoading) {
    return (
      <Private>
        <LoadPage />
      </Private>
    );
  }

  return (
    <Private>
      <Navbar />
      <main className={styles.container}>
        <header className={styles.header}>
          <h1>Análise de Ocupação</h1>
          <p className={styles.dateSubtitle}>
            {new Date().toLocaleDateString("pt-BR")}
          </p>
        </header>

        {trips.length === 0 ? (
          <Card className={styles.noTrips}>
            <I.calendar size={64} color="#cbd5e1" />
            <h2>Sem viagens hoje</h2>
            <p>Não há registros de rotas para a data selecionada.</p>
          </Card>
        ) : (
          <div className={styles.tripGrid}>
            {trips.map((busTrip: BusTrip) => (
              <BusTripCard
                key={busTrip.id}
                busTrip={busTrip}
                reports={tripReportsMap[busTrip.id] ?? []}
                reservations={tripReservationsMap[busTrip.id] ?? []}
                onClick={() => navigate(`/viagens/${busTrip.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </Private>
  );
}
