import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  BusTripItemCard,
  DateInput,
  DualPage,
  EmptyState,
  Navbar,
  PageHeader,
  Private,
} from "../../components";
import {
  useBusTripById,
  useManyBusReservationsByDate,
  useManyBusTripReportsByDate,
  useManyBusTripsByDate,
} from "../../hooks";
import type { BusTrip } from "../../types";

import {
  BusReportsCard,
  BusReservationsCard,
  SelectedBusTripCard,
} from "./components";

import styles from "./styles.module.css";

const formatDate = (d: Date) => d.toISOString().split("T")[0];
const parseDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export function BusTripPage() {
  const { id } = useParams<{ id: string }>();

  const [date, setDate] = useState(new Date());
  const [selectedTrip, setSelectedTrip] = useState<BusTrip | null>(null);

  const dateStr = useMemo(() => formatDate(date), [date]);

  const { getBusTripById } = useBusTripById();
  const { trips, isLoading: tripsLoading } = useManyBusTripsByDate(dateStr);
  const { reservations, isLoading: reservationsLoading } =
    useManyBusReservationsByDate(dateStr);
  const { reports, isLoading: reportsLoading } =
    useManyBusTripReportsByDate(dateStr);

  const isLoading = tripsLoading || reservationsLoading || reportsLoading;

  const currentTripReservations = useMemo(
    () => reservations.filter((r) => r.bus_trip_id === selectedTrip?.id) ?? [],
    [reservations, selectedTrip?.id],
  );

  const currentTripReports = useMemo(
    () => reports.filter((r) => r.bus_trip_id === selectedTrip?.id) ?? [],
    [reports, selectedTrip?.id],
  );

  useEffect(() => {
    if (id) {
      getBusTripById(id).then(setSelectedTrip);
    } else if (trips.length > 0 && !selectedTrip) {
      setSelectedTrip(trips[0]);
    }
  }, [id, trips, getBusTripById, selectedTrip]);

  return (
    <Private>
      <Navbar />
      <DualPage
        leftSide={
          <aside className={styles.leftSidebar}>
            <header className={styles.header}>
              <PageHeader
                title="Viagens"
                description="Gerencie as rotas diárias"
              />
            </header>
            <hr />
            <nav>
              <DateInput
                value={formatDate(date)}
                onChange={(e) => setDate(parseDate(e.target.value))}
              />
            </nav>

            <ul className={styles.tripList}>
              {trips.map((trip) => (
                <BusTripItemCard
                  key={trip.id}
                  trip={trip}
                  isSelected={trip.id === selectedTrip?.id}
                  onSelectTrip={setSelectedTrip}
                />
              ))}
              {!isLoading && trips.length === 0 && (
                <li className={styles.emptyMsg}>Nenhuma viagem nesta data.</li>
              )}
            </ul>
          </aside>
        }
        rightSide={
          <main className={styles.mainArea}>
            {selectedTrip ? (
              <article>
                <SelectedBusTripCard
                  selectedTrip={selectedTrip}
                  reservationsLength={currentTripReservations.length}
                  reports={currentTripReports}
                  onStatusUpdated={(status) =>
                    setSelectedTrip({ ...selectedTrip, status })
                  }
                />

                <div className={styles.detailsGrid}>
                  <section className={styles.gridColumn}>
                    <h3>Reservas ({currentTripReservations.length})</h3>
                    <BusReservationsCard
                      reservations={currentTripReservations}
                    />
                  </section>

                  <section className={styles.gridColumn}>
                    <h3>Relatórios ({currentTripReports.length})</h3>
                    <BusReportsCard reports={currentTripReports} />
                  </section>
                </div>
              </article>
            ) : (
              <EmptyState
                icon="map"
                title="Nenhuma viagem selecionada"
                description="Clique numa viagem na lista à esquerda para ver os detalhes."
              />
            )}
          </main>
        }
      />
    </Private>
  );
}
