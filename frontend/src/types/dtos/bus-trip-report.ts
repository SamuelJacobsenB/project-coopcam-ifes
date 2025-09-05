import type { User, BusTrip } from ".";

export interface BusTripReport {
    id: string;
    user_id: string;
    bus_trip_id: string;

    date: Date;
    period: string;
    direction: string;
    marked: boolean;
    attended: boolean;

    user: User | null;
    bus_trip: BusTrip | null;

    created_at: Date;
    updated_at: Date;
}