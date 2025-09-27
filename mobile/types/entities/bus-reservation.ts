import type { Direction, Period } from "../";

export interface BusReservation {
  id: string;
  bus_trip_id: string;

  user_id: string;
  user_name: string;

  date: Date;
  period: Period;
  direction: Direction;

  created_at: Date;
  updated_at: Date;
}
