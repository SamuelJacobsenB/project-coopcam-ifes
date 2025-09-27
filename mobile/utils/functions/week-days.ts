export function translateWeekDay(day: string): string {
  switch (day) {
    case "Sunday":
      return "Domingo";
    case "Monday":
      return "Segunda";
    case "Tuesday":
      return "Terça";
    case "Wednesday":
      return "Quarta";
    case "Thursday":
      return "Quinta";
    case "Friday":
      return "Sexta";
    case "Saturday":
      return "Sábado";
    default:
      return "Domingo";
  }
}
