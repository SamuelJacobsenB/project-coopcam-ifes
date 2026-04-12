import { Direction, Period } from "../others";

export interface BusReservationRequestDTO {
  date: Date;
  period: Period;
  direction: Direction;
}