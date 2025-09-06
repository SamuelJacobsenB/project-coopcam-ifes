export interface UserRequestDTO {
  name: string;
  email: string;
  password: string;

  cpf: string;
  phone: string;
  adress: string;
  cep: string;
  birth: Date;
}

export interface UserUpdateDTO {
  name: string | null;
  email: string | null;
  password: string | null;

  cpf: string | null;
  phone: string | null;
  adress: string | null;
  cep: string | null;
  birth: Date | null;
}
