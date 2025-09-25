import { Card, I } from "../../../../components";
import type { BusTrip, Status } from "../../../../types";

import { TripStatusControl } from "../trip-status-control";

import styles from "./styles.module.css";

interface BusTripCardProps {
  selectedTrip: BusTrip;
  onStatusUpdated: (status: Status) => void;
}

export function BusTripCard({
  selectedTrip,
  onStatusUpdated,
}: BusTripCardProps) {
  return (
    <Card className={styles.selectedTripBox}>
      <div className={styles.tripGraph}></div>

      <div className={styles.tripInfo}>
        <h1>{selectedTrip.direction === "go" ? "Ida" : "Volta"}</h1>
        <hr />
        <small>{selectedTrip.period === "morning" ? "Manhã" : "Tarde"}</small>
        <small>
          <I.calendar /> {new Date(selectedTrip.date).toLocaleDateString()}
        </small>

        <TripStatusControl
          trip={selectedTrip}
          onStatusUpdated={onStatusUpdated}
        />
      </div>
    </Card>
  );
}
