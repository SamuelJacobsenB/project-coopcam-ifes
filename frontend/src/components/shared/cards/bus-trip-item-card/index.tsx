import { Card, DirectionBadge, I } from "../../../../components";
import type { BusTrip } from "../../../../types";

import styles from "./styles.module.css";

interface BusTripItemCardProps {
  trip: BusTrip;
  isSelected: boolean;
  onSelectTrip: (trip: BusTrip) => void;
}

export function BusTripItemCard({
  trip,
  isSelected,
  onSelectTrip,
}: BusTripItemCardProps) {
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
          {trip.period === "morning" ? "Manhã" : "Tarde"}
        </span>
      </div>
      <div className={styles.directionBadge}>
        <DirectionBadge direction={trip.direction} />
      </div>
    </Card>
  );
}
