export function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function parseDateInput(value: string): Date {
  const [year, month, day] = value.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day), 12);
}

export const normalizeDate = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    12,
    0,
    0,
  ).toISOString();
};

export const safeISOString = (
  dateValue: string | Date | null | undefined,
): string => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  return !isNaN(date.getTime()) ? date.toISOString() : "";
};

export const formatDateForInput = (dateValue: string): string => {
  const iso = safeISOString(dateValue);
  return iso ? iso.split("T")[0] : "";
};
