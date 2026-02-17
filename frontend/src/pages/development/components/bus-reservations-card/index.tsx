import { useState } from "react";

import { Card, I } from "../../../../components";
import type { BusReservation } from "../../../../types";

import styles from "./styles.module.css";

interface BusReservationsCardProps {
  reservations: BusReservation[];
}

export function BusReservationsCard({
  reservations,
}: BusReservationsCardProps) {
  const [isReservationsOpen, setIsReservationsOpen] = useState(false);

  return (
    <Card className={styles.reservationsBox}>
      <button
        className={styles.reservationsBoxButton}
        onClick={() => setIsReservationsOpen(!isReservationsOpen)}
      >
        {isReservationsOpen ? <I.arrow_back /> : <I.arrow_up />}
      </button>
      <header className={styles.reservationsBoxHeader}>
        <h2>Reservas</h2>
        <p>Número de reservas: {reservations.length}</p>
      </header>
      {isReservationsOpen && (
        <ul className={styles.reservationsList}>
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <Card>{reservation.user_name}</Card>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
