import { BusReservation, Direction, Period } from "@/types";

export function filterReservations(
  reservations: BusReservation[],
  period: Period,
  direction: Direction
) {
  return reservations.filter(
    (r) => r.period === period && r.direction === direction
  );
}
