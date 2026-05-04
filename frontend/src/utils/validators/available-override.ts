import type { AvailableOverrideRequestDTO } from "../../types";

export function validateAvailableOverrideRequestDTO(
  availableOverride: AvailableOverrideRequestDTO,
): string {
  if (!availableOverride.date) return "Data é obrigatória";

  if (!availableOverride.reason) return "Motivo é obrigatório";

  if (availableOverride.reason.length > 128)
    return "Motivo deve ter no máximo 128 caracteres";

  return "";
}
