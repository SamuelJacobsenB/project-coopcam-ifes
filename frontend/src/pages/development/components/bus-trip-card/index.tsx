import { Card, I } from "../../../../components";
import type { BusTrip } from "../../../../types";

import styles from "./styles.module.css";

interface BusTripCardProps {
  trip: BusTrip;
  isSelected: boolean;
  onSelectTrip: (trip: BusTrip) => void;
}

export function BusTripCard({
  trip,
  isSelected,
  onSelectTrip,
}: BusTripCardProps) {
  return (
    <Card
      className={`${styles.tripItem} ${isSelected ? styles.selectedTrip : ""}`}
      onClick={() => onSelectTrip(trip)}
    >
      <div className={styles.tripItemMain}>
        <div className={styles.tripItemDate}>
          {trip.period === "morning" ? (
            <I.sun size={18} color="#eab308" />
          ) : (
            <I.moon size={18} color="#6366f1" />
          )}
          <h5>{new Date(trip.date).toLocaleDateString("pt-BR")}</h5>
        </div>
        <span className={styles.routeText}>
          {trip.direction === "go" ? "Ida" : "Retorno"}
        </span>
      </div>
      <span
        className={`${styles.badge} ${trip.direction === "go" ? styles.badgeGo : styles.badgeBack}`}
      >
        {trip.direction === "go" ? (
          <I.arrow_forward size={12} />
        ) : (
          <I.arrow_back size={12} />
        )}
        {trip.direction === "go" ? "Ida" : "Volta"}
      </span>
    </Card>
  );
}
