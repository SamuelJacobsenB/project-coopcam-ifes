import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  useBusTripById,
  useManyBusReservationsByDate,
  useManyBusTripReportsByDate,
  useManyBusTripsByDate,
} from "../../hooks";
import {
  Card,
  DateInput,
  DualPage,
  I,
  Navbar,
  Private,
} from "../../components";
import { isSameDate, parseDateInput } from "../../utils";
import type { BusReservation, BusTrip, BusTripReport } from "../../types";

import { BusReportsCard, BusReservationsCard, BusTripCard } from "./components";

import styles from "./styles.module.css";

export function BusTripPage() {
  const { id } = useParams();

  const { getBusTripById } = useBusTripById();
  const { getManyBusTripsByDate } = useManyBusTripsByDate();
  const { getManyBusReservationsByDate } = useManyBusReservationsByDate();
  const { getManyBusTripReportsByDate } = useManyBusTripReportsByDate();

  const [date, setDate] = useState(new Date());
  const [trips, setTrips] = useState<BusTrip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<BusTrip | null>(null);
  const [reservations, setReservations] = useState<BusReservation[]>([]);
  const [reports, setReports] = useState<BusTripReport[]>([]);

  useEffect(() => {
    const strDate = date.toISOString().split("T")[0];

    getManyBusTripsByDate(strDate).then(setTrips);
    getManyBusTripReportsByDate(strDate).then(setReports);
    getManyBusReservationsByDate(strDate).then(setReservations);
  }, [
    date,
    getManyBusTripsByDate,
    getManyBusTripReportsByDate,
    getManyBusReservationsByDate,
  ]);

  useEffect(() => {
    if (id) getBusTripById(id).then(setSelectedTrip);
  }, [id, getBusTripById]);

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
              onChange={(e) => setDate(parseDateInput(e.target.value))}
              placeholder="Buscar viagens..."
            />

            <ul className={styles.tripList}>
              {trips
                .filter((trip) => isSameDate(new Date(trip.date), date))
                .map((trip) => (
                  <li key={trip.id}>
                    <Card
                      className={`${styles.tripItem} ${
                        selectedTrip?.id === trip.id ? styles.selectedTrip : ""
                      }`}
                      onClick={() => setSelectedTrip(trip)}
                    >
                      <span className={styles.tripItemDate}>
                        <I.calendar />
                        <h5>{new Date(trip.date).toLocaleDateString()}</h5>
                      </span>
                      <span className={styles.tripItemInfo}>
                        <small>
                          {trip.period === "morning" ? "Manhã" : "Tarde"}
                        </small>
                        <small>
                          {trip.direction === "go" ? "Ida" : "Volta"}
                        </small>
                      </span>
                    </Card>
                  </li>
                ))}
            </ul>
          </>
        }
        rightSide={
          <>
            {selectedTrip ? (
              <div className={styles.busTripArea}>
                <BusTripCard
                  selectedTrip={selectedTrip}
                  onStatusUpdated={(status) =>
                    setSelectedTrip({ ...selectedTrip, status })
                  }
                />
                {reservations.length > 0 && (
                  <BusReservationsCard
                    reservations={reservations.filter(
                      (reservation) =>
                        reservation.bus_trip_id === selectedTrip.id
                    )}
                  />
                )}
                {reports.length > 0 && (
                  <BusReportsCard
                    reports={reports.filter(
                      (report) => report.bus_trip_id === selectedTrip.id
                    )}
                  />
                )}
              </div>
            ) : (
              <Card className={styles.nonSelectedTripBox}>
                <h1>Selecione uma viagem</h1>
                <p>Selecione uma viagem para ver mais detalhes sobre esta.</p>
              </Card>
            )}
          </>
        }
        leftClassName={styles.left}
        rightClassName={styles.right}
      />
    </Private>
  );
}
