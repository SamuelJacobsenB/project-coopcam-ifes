import type { Role, Template, WeeklyPreference } from "../";

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

  has_financial_aid: boolean;

  template: Template | null;
  weekly_preference: WeeklyPreference | null;

  created_at: Date;
  updated_at: Date;
}
