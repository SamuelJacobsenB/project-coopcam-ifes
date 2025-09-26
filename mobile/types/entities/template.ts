import type { DaySchedule } from "../";

export interface Template {
    id: string;
    user_id: string;

    go_schedule: DaySchedule;
    return_schedule: DaySchedule;

    created_at: Date;
    updated_at: Date;
}