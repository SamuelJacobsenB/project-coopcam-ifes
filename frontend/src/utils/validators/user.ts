import type { UserRequestDTO, UserUpdateDTO } from "../../types";

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const CPF_REGEX = /^\d{11}$/;
const PHONE_REGEX = /^\d{10,11}$/;
const CEP_REGEX = /^\d{8}$/;
const PASSWORD_REGEX =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,15}$/;

export function validateUserRequestDTO(user: UserRequestDTO): string {
  if (!user.name) {
    return "O nome deve ser preenchido";
  }

  if (!user.email) {
    return "O email deve ser preenchido";
  }

  if (user.email.length > 254) {
    return "O email deve ter no máximo 254 caracteres";
  }

  if (!EMAIL_REGEX.test(user.email)) {
    return "O email deve ser válido";
  }

  if (!user.password) {
    return "A senha deve ser preenchida";
  }

  if (user.password.length < 8) {
    return "A senha deve ter no mínimo 8 caracteres";
  }

  if (user.password.length > 15) {
    return "A senha deve ter no máximo 15 caracteres";
  }

  if (user.password.includes(" ")) {
    return "A senha não pode conter espaços em branco";
  }

  if (!PASSWORD_REGEX.test(user.password)) {
    return "A senha deve conter no mínimo uma letra minúscula, uma letra maiúscula, um número e um caractere especial";
  }

  if (!user.cpf) {
    return "O CPF deve ser preenchido";
  }

  if (!CPF_REGEX.test(user.cpf)) {
    return "O CPF deve conter 11 dígitos";
  }

  if (!user.phone) {
    return "O telefone deve ser preenchido";
  }

  if (!PHONE_REGEX.test(user.phone)) {
    return "O telefone deve ter 10 ou 11 dígitos";
  }

  if (!user.address) {
    return "O endereço deve ser preenchido";
  }

  if (user.address.length < 3 || user.address.length > 128) {
    return "O endereço deve ter entre 3 e 128 caracteres";
  }

  if (!user.birth) {
    return "A data de nascimento deve ser preenchida";
  }

  if (!user.cep) {
    return "O CEP deve ser preenchido";
  }

  if (!CEP_REGEX.test(user.cep)) {
    return "O CEP deve conter 8 dígitos";
  }

  return "";
}

export function validateUserUpdateDTO(user: UserUpdateDTO): string {
  if (user.name) {
    user.name = user.name.trim();
    if (user.name.length < 3 || user.name.length > 64) {
      return "O nome deve ter entre 3 e 64 caracteres";
    }
  }

  if (user.email) {
    user.email = user.email.trim();
    if (user.email.length > 254) {
      return "O email deve ter no máximo 254s caracteres";
    }

    if (!EMAIL_REGEX.test(user.email)) {
      return "O email deve ser válido";
    }
  }

  if (user.password) {
    if (user.password.length < 8) {
      return "A senha deve ter no mínimo 8 caracteres";
    }

    if (user.password.length > 15) {
      return "A senha deve ter no.maxcdn 15 caracteres";
    }

    if (user.password.includes(" ")) {
      return "A senha não pode conter espaços em branco";
    }

    if (!PASSWORD_REGEX.test(user.password)) {
      return "A senha deve conter no mínimo uma letra minúscula, uma letra maiúscula, um número e um caractere especial";
    }
  }

  if (user.cpf) {
    if (!CPF_REGEX.test(user.cpf)) {
      return "O CPF deve conter 11 dígitos";
    }
  }

  if (user.phone) {
    if (!PHONE_REGEX.test(user.phone)) {
      return "O telefone deve ter 10 ou 11 dígitos";
    }
  }

  if (user.address) {
    if (user.address.length < 3 || user.address.length > 128) {
      return "O endereço deve ter entre 3 e 128 caracteres";
    }
  }

  if (user.cep) {
    if (!CEP_REGEX.test(user.cep)) {
      return "O CEP deve conter 8 dígitos";
    }
  }

  return "";
}
