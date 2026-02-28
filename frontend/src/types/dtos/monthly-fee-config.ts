export interface MonthlyFeeConfigRequestDTO {
  month: number;
  year: number;

  base_amount: number;
  financial_aid_amount: number;

  due_date: Date;
}
