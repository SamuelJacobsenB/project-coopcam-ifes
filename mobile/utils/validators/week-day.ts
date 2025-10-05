export function validateWeekDay(weekDay: number) {
  return !isNaN(weekDay) && weekDay >= 0 && weekDay <= 6;
}
