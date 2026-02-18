import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, I } from "../../../../components";
import type { BusReservation } from "../../../../types";

import styles from "./styles.module.css";

interface BusReservationsCardProps {
  reservations: BusReservation[];
}

export function BusReservationsCard({
  reservations,
}: BusReservationsCardProps) {
  const navigate = useNavigate();

  const [isReservationsOpen, setIsReservationsOpen] = useState(false);

  return (
    <Card className={styles.reservationsBox}>
      {reservations.length > 0 && (
        <button
          className={styles.reservationsBoxButton}
          onClick={() => setIsReservationsOpen(!isReservationsOpen)}
        >
          {isReservationsOpen ? <I.arrow_down /> : <I.arrow_up />}
        </button>
      )}
      <h2>Reservas</h2>

      {isReservationsOpen && reservations.length > 0 && (
        <>
          <hr style={{ margin: "1rem 0", opacity: 0.2 }} />
          <ul className={styles.reservationsList}>
            {reservations.map((reservation) => (
              <li key={reservation.id}>
                <div
                  onClick={() => navigate(`/usuarios/${reservation.user_id}`)}
                  className={styles.userCard}
                >
                  {reservation.user_name}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
