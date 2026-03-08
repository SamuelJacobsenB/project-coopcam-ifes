export interface MonthlyFeeConfig {
  id: string;

  month: number;
  year: number;

  base_amount: number;
  financial_aid_amount: number;

  due_date: Date;

  created_at: Date;
  updated_at: Date;
}
