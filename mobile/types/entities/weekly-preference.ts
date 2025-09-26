import type { BusReservation } from "./";

export interface WeeklyPreference {
    id: string;
    user_id: string;

    week_start: Date;
    overrides: BusReservation[];

    created_at: Date;
    updated_at: Date;
}