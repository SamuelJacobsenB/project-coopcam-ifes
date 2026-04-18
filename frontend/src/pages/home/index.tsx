import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BusTripCard,
  Card,
  I,
  Loader,
  Navbar,
  Private,
} from "../../components";
import {
  useManyBusReservationsByDate,
  useManyBusTripReportsByDate,
  useManyBusTripsByDate,
} from "../../hooks";
import type { BusReservation, BusTrip, BusTripReport } from "../../types";

import styles from "./styles.module.css";

interface DashboardData {
  trips: BusTrip[];
  reports: BusTripReport[];
  reservations: BusReservation[];
}

export function DashboardPage() {
  const navigate = useNavigate();

  const { getManyBusTripsByDate } = useManyBusTripsByDate();
  const { getManyBusTripReportsByDate } = useManyBusTripReportsByDate();
  const { getManyBusReservationsByDate } = useManyBusReservationsByDate();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    trips: [],
    reports: [],
    reservations: [],
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);
        // Garante o formato YYYY-MM-DD considerando o timezone local
        const today = new Date().toISOString().split("T")[0];

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

  if (isLoading) {
    return (
      <Private>
        <Navbar />
        <main className={styles.container}>
          <h1>Análise de Ocupação</h1>
          <h3>Carregando análise...</h3>
          <Loader />
        </main>
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

        {data.trips.length === 0 ? (
          <Card className={styles.noTrips}>
            <I.calendar size={64} color="#cbd5e1" />
            <h2>Sem viagens hoje</h2>
            <p>Não há registros de rotas para a data selecionada.</p>
          </Card>
        ) : (
          <div className={styles.tripGrid}>
            {data.trips.map((busTrip) => (
              <BusTripCard
                key={busTrip.id}
                busTrip={busTrip}
                reports={data.reports.filter(
                  (r) => r.bus_trip_id === busTrip.id,
                )}
                reservations={data.reservations.filter(
                  (r) => r.bus_trip_id === busTrip.id,
                )}
                onClick={() => navigate(`/viagens/${busTrip.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </Private>
  );
}
