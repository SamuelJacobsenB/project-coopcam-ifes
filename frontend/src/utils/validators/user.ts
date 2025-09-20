import type { UserRequestDTO } from "../../types";

export function validateUserRequestDTO(user: UserRequestDTO): string {
  if (!user.name) {
    return "O nome deve ser preenchido";
  }

  if (!user.email) {
    return "O email deve ser preenchido";
  }

  if (!user.email.includes("@")) {
    return "O email deve ser válido";
  }

  if (!user.password) {
    return "A senha deve ser preenchida";
  }

  if (user.password.length < 8) {
    return "A senha deve ter no mínimo 8 caracteres";
  }

  if (user.password.length > 15) {
    return "A senha deve ter no máximo 15 caracteres";
  }

  if (user.password.includes(" ")) {
    return "A senha não pode conter espaços em branco";
  }

  if (!/^(?=.*[A-Za-z])(?=.*\d)[^\s]{8,15}$/.test(user.password)) {
    return "A senha deve conter no mínimo um número e uma letra";
  }

  if (!user.cpf) {
    return "O CPF deve ser preenchido";
  }

  if (user.cpf.length !== 11) {
    return "O CPF deve ter 11 caracteres";
  }

  if (!user.phone) {
    return "O telefone deve ser preenchido";
  }

  if (!user.adress) {
    return "O endereço deve ser preenchido";
  }

  if (!user.birth) {
    return "A data de nascimento deve ser preenchida";
  }

  if (!user.cep) {
    return "O CEP deve ser preenchido";
  }

  if (user.cep.length !== 8) {
    return "O CEP deve ter 8 caracteres";
  }

  return "";
}
