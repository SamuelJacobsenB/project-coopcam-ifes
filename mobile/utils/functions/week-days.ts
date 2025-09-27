export function getWeekDay(day: number): string {
  switch (day) {
    case 0:
      return "Domingo";
    case 1:
      return "Segunda";
    case 2:
      return "Terça";
    case 3:
      return "Quarta";
    case 4:
      return "Quinta";
    case 5:
      return "Sexta";
    case 6:
      return "Sábado";
    default:
      return "Domingo";
  }
}

export function getDateOfWeekDay(targetDayIndex: number): Date {
  const today = new Date();
  const currentDayIndex = today.getDay();

  const diff = targetDayIndex - currentDayIndex;

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);

  targetDate.setHours(0, 0, 0, 0);

  return targetDate;
}
