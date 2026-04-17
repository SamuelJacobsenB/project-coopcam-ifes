import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { C, Card, I, Loader, Navbar, Private } from "../../components";
import {
  useManyBusReservationsByDate,
  useManyBusTripReportsByDate,
  useManyBusTripsByDate,
} from "../../hooks";
import type { BusReservation, BusTrip, BusTripReport } from "../../types";

import styles from "./styles.module.css";

export function DashboardPage() {
  const navigate = useNavigate();

  const { getManyBusTripsByDate } = useManyBusTripsByDate();
  const { getManyBusTripReportsByDate } = useManyBusTripReportsByDate();
  const { getManyBusReservationsByDate } = useManyBusReservationsByDate();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<{
    trips: BusTrip[];
    reports: BusTripReport[];
    reservations: BusReservation[];
  }>({
    trips: [],
    reports: [],
    reservations: [],
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);
        const today = new Date().toISOString().split("T")[0];

        // Carrega tudo em paralelo para ser mais rápido
        const [trips, reports, reservations] = await Promise.all([
          getManyBusTripsByDate(today),
          getManyBusTripReportsByDate(today),
          getManyBusReservationsByDate(today),
        ]);

        if (isMounted) {
          setData({ trips, reports, reservations });
        }
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [
    getManyBusTripsByDate,
    getManyBusTripReportsByDate,
    getManyBusReservationsByDate,
  ]);

  // Renderização de Carregamento
  if (isLoading) {
    return (
      <Private>
        <Navbar />
        <div className={styles.container}>
          <h1>Análise de Ocupação</h1>
          <h3>Carregando análise...</h3>
          <Loader />
        </div>
      </Private>
    );
  }

  return (
    <Private>
      <Navbar />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Análise de Ocupação</h1>
          <p className={styles.dateSubtitle}>
            {new Date().toLocaleDateString()}
          </p>
        </header>

        {data.trips.length === 0 ? (
          <Card className={styles.noTrips}>
            <I.calendar size={64} color="#cbd5e1" />
            <h2>Sem viagens hoje</h2>
            <p>Não há registros de rotas para a data selecionada.</p>
          </Card>
        ) : (
          <div className={styles.tripGrid}>
            {data.trips.map((busTrip) => {
              const tripReports = data.reports.filter(
                (r) => r.bus_trip_id === busTrip.id,
              );
              const tripReservations = data.reservations.filter(
                (r) => r.bus_trip_id === busTrip.id,
              );

              const stats = {
                presente: tripReports.filter((r) => r.marked && r.attended)
                  .length,
                falta: tripReports.filter((r) => r.marked && !r.attended)
                  .length,
                extra: tripReports.filter((r) => !r.marked && r.attended)
                  .length,
              };

              const hasReports = tripReports.length > 0;

              return (
                <Card
                  key={busTrip.id}
                  className={styles.tripCard}
                  onClick={() => navigate(`/viagens/${busTrip.id}`)}
                  variant="elevated"
                >
                  <div className={styles.tripGraph}>
                    <C.pizza
                      data={{
                        labels: hasReports
                          ? ["Presente", "Falta", "Extra"]
                          : ["Reservas"],
                        datasets: [
                          {
                            data: hasReports
                              ? [stats.presente, stats.falta, stats.extra]
                              : [tripReservations.length || 1],
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
                      <span
                        className={`${styles.badge} ${styles[busTrip.direction]}`}
                      >
                        {busTrip.direction === "go" ? "IDA" : "VOLTA"}
                      </span>
                      <span
                        className={`${styles.statusDot} ${styles[busTrip.status]}`}
                      />
                    </div>

                    <div className={styles.tripDetails}>
                      <p>
                        <strong>
                          {busTrip.period === "morning" ? "Manhã" : "Tarde"}
                        </strong>
                      </p>
                      <span>
                        {hasReports
                          ? `${tripReports.length} ${tripReports.length > 1 ? "Relatórios" : "Relatório"}`
                          : `${tripReservations.length} ${tripReservations.length > 1 ? "Reservas" : "Reserva"}`}
                      </span>
                      <span className={styles.statusLabel}>
                        {busTrip.status === "finished" && "Finalizada"}
                        {busTrip.status === "started" && "Em andamento"}
                        {busTrip.status === "unstarted" && "Aguardando início"}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Private>
  );
}
