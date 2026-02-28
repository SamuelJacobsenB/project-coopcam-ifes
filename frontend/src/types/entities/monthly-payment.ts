import type { PaymentStatus } from "../others";

export interface MonthlyPayment {
  id: string;
  user_id: string;

  month: number;
  year: number;

  amount: number;
  payment_status: PaymentStatus;
  due_date: Date;

  payment_url: string | null;
  pix_qr_code: string | null;

  paid_at: Date | null;
}
