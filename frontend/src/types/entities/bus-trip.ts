import type { Direction, Period, Status } from "../";

export interface BusTrip {
    id: string;

    date: Date;
    period: Period;
    direction: Direction;
    status: Status;
    
    created_at: Date;
    updated_at: Date;
}