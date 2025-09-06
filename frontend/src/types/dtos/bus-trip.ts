import type { Direction, Period } from "../others";

export interface BusTripRequestDTO {
  date: Date;
  period: Period;
  direction: Direction;
}

export interface BusTripUpdateDTO {
  date: Date | null;
  period: Period | null;
  direction: Direction | null;
}
