export interface UserRequestDTO {
  name: string;
  email: string;
  password: string;

  cpf: string;
  phone: string;
  address: string;
  cep: string;
  birth: string;
}

export interface UserUpdateDTO {
  name: string | null;
  email: string | null;
  password: string | null;

  cpf: string | null;
  phone: string | null;
  address: string | null;
  cep: string | null;
  birth: Date | null;
}
