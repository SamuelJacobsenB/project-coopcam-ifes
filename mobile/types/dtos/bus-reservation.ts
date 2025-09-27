import { Direction, Period } from "../others";

export interface BusReservationRequestDTO {
  bus_trip_id: string;

  user_id: string;
  user_name: string;

  date: Date;
  period: Period;
  direction: Direction;
}

export interface BusReservationUpdateDTO {
  date: Date | null;
  period: string | null;
}
