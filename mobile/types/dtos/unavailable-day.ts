export interface UnavailableDayRequestDTO {
  date: Date;
  reason: string;
}

export interface UnavailableDayUpdateDTO {
  date: Date | null;
  reason: string | null;
}
