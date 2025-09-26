import type { Direction, Period } from "../";

export interface BusTripReportRequestDTO {
  user_id: string;

  date: Date;
  period: Period;
  direction: Direction;
  marked: boolean; // TODO: remove
  attended: boolean; // TODO: remove
}

export interface BusTripReportUpdateDTO {
  date: Date | null;
  period: Period | null;
  direction: Direction | null;
}
