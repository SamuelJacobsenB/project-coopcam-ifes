export interface BusReservation {
    id: string;
    user_id: string;

    date: Date;
    period: string;
    attended: boolean | null;

    weekly_preference_id: string | null;

    createdAt: Date;
    updatedAt: Date;
}