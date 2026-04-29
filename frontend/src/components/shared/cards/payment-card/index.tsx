import { useState } from "react";

import type { MonthlyPayment } from "../../../../types";

import { PaymentDetailsModal } from "../../modals";
import { PaymentStatusBadge } from "../../badges";
import { Card } from "../card";

import styles from "./styles.module.css";

interface PaymentCardProps {
  monthly_payment: MonthlyPayment;
  main_info: string;
}

export function PaymentCard({ monthly_payment, main_info }: PaymentCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className={styles.paymentCard} onClick={() => setIsModalOpen(true)}>
        <div className={styles.userInfo}>
          <div className={styles.userMainInfo}>
            <strong>{main_info}</strong>
            <span className={styles.userAmount}>
              {monthly_payment.amount.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>

          <div className={styles.userMeta}>
            <span>
              Vencimento:{" "}
              {new Date(monthly_payment.due_date).toLocaleDateString("pt-BR")}
            </span>
            {monthly_payment.paid_at && (
              <>
                <span className={styles.dotSeparator}>•</span>
                <span className={styles.paidDate}>
                  Pago em:{" "}
                  {new Date(monthly_payment.paid_at).toLocaleDateString("pt-BR")}
                </span>
              </>
            )}
          </div>
        </div>

        <div className={styles.userAction}>
          <PaymentStatusBadge status={monthly_payment.payment_status} />
        </div>
      </Card>

      <PaymentDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        payment={monthly_payment}
      />
    </>
  );
}