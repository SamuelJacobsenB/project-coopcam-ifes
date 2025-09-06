import type { Period } from "../";

export interface BusReservation {
    id: string;
    user_id: string;

    date: Date;
    period: Period;
    attended: boolean | null;

    weekly_preference_id: string | null;

    created_at: Date;
    updated_at: Date;
}