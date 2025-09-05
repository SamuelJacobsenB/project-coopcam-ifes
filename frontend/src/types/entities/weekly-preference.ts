import type { BusReservation } from "./";

export interface WeeklyPreference {
    id: string;
    userID: string;

    weekStart: Date;
    overrides: BusReservation[];

    createdAt: Date;
    updatedAt: Date;
}