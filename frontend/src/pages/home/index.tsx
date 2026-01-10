import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useManyBusReservationsByDate,
  useManyBusTripReportsByDate,
  useManyBusTripsByDate,
} from "../../hooks";
import { C, Card, I, Navbar, Private } from "../../components";
import type { BusReservation, BusTrip, BusTripReport } from "../../types";

import styles from "./styles.module.css";

export function DashboardPage() {
  const navigate = useNavigate();

  // Hooks de dados
  const { getManyBusTripsByDate } = useManyBusTripsByDate();
  const { getManyBusTripReportsByDate } = useManyBusTripReportsByDate();
  const { getManyBusReservationsByDate } = useManyBusReservationsByDate();

  // Estados
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
          <h1>Carregando análise...</h1>
          {/* Aqui você poderia colocar um Skeleton Loader */}
        </div>
      </Private>
    );
  }

  return (
    <Private>
      <Navbar />
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Análise diária</h1>
          <p>{new Date().toLocaleDateString()}</p>
        </header>

        {data.trips.length === 0 ? (
          <Card className={styles.noTrips}>
            <I.calendar size={48} color="#ccc" />
            <h2>Nenhuma viagem encontrada</h2>
            <p>Este dia não possui nenhuma viagem agendada.</p>
          </Card>
        ) : (
          <div className={styles.tripGrid}>
            {data.trips.map((busTrip) => {
              // Filtragem de dados para esta viagem específica
              const tripReports = data.reports.filter(
                (r) => r.bus_trip_id === busTrip.id
              );
              const tripReservations = data.reservations.filter(
                (r) => r.bus_trip_id === busTrip.id
              );

              // Lógica do Gráfico
              const stats = {
                marcouEFoi: tripReports.filter((r) => r.marked && r.attended)
                  .length,
                marcouENaoFoi: tripReports.filter(
                  (r) => r.marked && !r.attended
                ).length,
                naoMarcouEFoi: tripReports.filter(
                  (r) => !r.marked && r.attended
                ).length,
              };

              const hasReports = tripReports.length > 0;

              return (
                <Card
                  key={busTrip.id}
                  className={styles.tripCard}
                  onClick={() => navigate(`/viagens/${busTrip.id}`)}
                  variant="elevated" // Assumindo que seu novo Card suporta isso
                >
                  <div className={styles.tripGraph}>
                    {hasReports ? (
                      <C.pizza
                        data={{
                          labels: [
                            "Presente (Marcado)",
                            "Ausente (Marcado)",
                            "Presente (Extra)",
                          ],
                          datasets: [
                            {
                              label: "Passageiros",
                              data: [
                                stats.marcouEFoi,
                                stats.marcouENaoFoi,
                                stats.naoMarcouEFoi,
                              ],
                              backgroundColor: [
                                "#22c55e",
                                "#eab308",
                                "#ef4444",
                              ], // Cores hex (verde, amarelo, vermelho)
                            },
                          ],
                        }}
                        labelDisplay={false}
                      />
                    ) : (
                      <C.pizza
                        data={{
                          labels: ["Reservas"],
                          datasets: [
                            {
                              label: "Total",
                              data: [tripReservations.length || 1], // 1 para gráfico não sumir se 0
                              backgroundColor: [
                                tripReservations.length > 0
                                  ? "#64748b"
                                  : "#e2e8f0",
                              ],
                            },
                          ],
                        }}
                        labelDisplay={false}
                      />
                    )}
                  </div>

                  <div className={styles.tripInfo}>
                    <div className={styles.tripBadge}>
                      {busTrip.direction === "go" ? "IDA" : "VOLTA"}
                    </div>

                    <div className={styles.tripDetails}>
                      <span>
                        <I.clock size={14} />{" "}
                        {busTrip.period === "morning" ? "Manhã" : "Tarde"}
                      </span>
                      <span>
                        Status:{" "}
                        <strong>
                          {busTrip.status === "finished" && "Finalizada"}
                          {busTrip.status === "started" && "Iniciada"}
                          {busTrip.status === "unstarted" && "Não Iniciada"}
                        </strong>
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
