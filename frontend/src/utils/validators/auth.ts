import type { LoginDTO } from "../../types";

export function validateLoginDTO(dto: LoginDTO): string {
  if (dto.email == null || dto.email == "") {
    return "Email requerido";
  }
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(dto.email)) {
    return "Email inválido";
  }

  if (dto.password == null || dto.password == "") {
    return "Senha requerida";
  }
  if (dto.password.length < 8) {
    return "Senha deve ter no mínimo 8 caracteres";
  }
  if (dto.password.length > 15) {
    return "Senha deve ter no máximo 15 caracteres";
  }

  return "";
}
