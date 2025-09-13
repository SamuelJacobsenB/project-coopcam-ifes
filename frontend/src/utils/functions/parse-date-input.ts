export function parseDateInput(value: string): Date {
  const [year, month, day] = value.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}
