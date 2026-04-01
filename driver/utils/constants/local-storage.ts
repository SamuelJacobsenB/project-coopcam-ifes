export const STORAGE_KEYS = {
  SCANNED: (id: string) => `@scanned_users_${id}`,
  RESERVATIONS: (id: string) => `@reservations_trip_${id}`,
  BUS_TRIP: (id: string) => `@bus_trip_${id}`,
  BUS_TRIPS_BY_DATE: (date: string) => `@bus_trips_date_${date}`,
};
