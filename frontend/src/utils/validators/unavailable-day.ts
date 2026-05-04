import type { UnavailableDayRequestDTO } from "../../types";

export function validateUnavailableDayRequestDTO(
  unavailableDay: UnavailableDayRequestDTO,
): string {
  if (!unavailableDay.date) return "Data é obrigatória";

  if (!unavailableDay.reason) return "Motivo é obrigatório";

  if (unavailableDay.reason.length > 128)
    return "Motivo deve ter no máximo 128 caracteres";

  return "";
}
