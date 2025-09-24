export interface BusReservationRequestDTO {
  bus_trip_id: string;

  user_id: string;
  user_name: string;

  date: Date;
  period: string;
}

export interface BusReservationUpdateDTO {
  date: Date | null;
  period: string | null;
}
