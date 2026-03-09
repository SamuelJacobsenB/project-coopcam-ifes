import type { Role } from "../";

export interface User {
  id: string;
  template_id: string;
  weekly_preference_id: string;

  name: string;
  email: string;
  role: Role;

  cpf: string;
  phone: string;
  address: string;
  cep: string;
  birth: string;
  avatar_url: string | null;

  has_financial_aid: boolean;

  created_at: Date;
  updated_at: Date;
}
