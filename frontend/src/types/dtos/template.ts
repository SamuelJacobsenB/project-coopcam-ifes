import type { DaySchedule } from "../";

export interface TemplateRequestDTO {
  go_schedule: DaySchedule;
  return_schedule: DaySchedule;
}

export interface TemplateUpdateDTO {
  go_schedule: DaySchedule | null;
  return_schedule: DaySchedule | null;
}
