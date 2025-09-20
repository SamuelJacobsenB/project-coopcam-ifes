import type { AvailableOverrideRequestDTO } from "../../types";

export function validateAvailableOverrideRequestDTO(
  availableOverride: AvailableOverrideRequestDTO
): string {
  if (!availableOverride.date) return "Data é obrigatória";

  if (!availableOverride.reason) return "Motivo é obrigatório";

  if (availableOverride.reason.length > 500)
    return "Motivo deve ter no máximo 500 caracteres";

  return "";
}
