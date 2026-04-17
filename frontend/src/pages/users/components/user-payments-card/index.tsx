import { useEffect, useState } from "react";

import { Card, I, Loader, PaymentStatusBadge } from "../../../../components";

import { useManyMonthlyPaymentByUserId } from "../../../../hooks";
import type { MonthlyPayment } from "../../../../types";
import { monthToString } from "../../../../utils";
import styles from "./styles.module.css";

interface UserPaymentsCardProps {
  user_id: string;
}

export function UserPaymentsCard({ user_id }: UserPaymentsCardProps) {
  const { getMonthlyPaymentByUserId, isPending } =
    useManyMonthlyPaymentByUserId();

  const [isOpen, setIsOpen] = useState(false);
  const [payments, setPayments] = useState<MonthlyPayment[] | null>(null);

  useEffect(() => {
    getMonthlyPaymentByUserId(user_id).then((payments: MonthlyPayment[]) => {
      setPayments(payments);
    });
  }, [user_id, getMonthlyPaymentByUserId]);

  return (
    <Card className={styles.userPaymentsBox}>
      <button
        className={styles.userPaymentsBoxButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <I.arrow_down /> : <I.arrow_up />}
      </button>
      <h2>Pagamentos</h2>

      {isOpen && (
        <>
          <hr style={{ margin: "1rem 0", opacity: 0.2 }} />
          {isPending && <Loader />}
          {!isPending && payments?.length === 0 && (
            <p style={{ textAlign: "center", opacity: 0.5 }}>
              Nenhum pagamento encontrado.
            </p>
          )}
          {!isPending && payments?.length !== 0 && (
            <ul className={styles.userPaymentsList}>
              {payments?.map((p) => (
                <li key={p.id} className={styles.userListItem}>
                  <div className={styles.userInfo}>
                    <div className={styles.userMainInfo}>
                      <strong>
                        {p.year} / {monthToString(p.month)}
                      </strong>
                      <span className={styles.userAmount}>
                        {p.amount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>

                    <div className={styles.userMeta}>
                      <span>
                        Vencimento:{" "}
                        {new Date(p.due_date).toLocaleDateString("pt-BR")}
                      </span>
                      {p.paid_at && (
                        <>
                          <span className={styles.dotSeparator}>•</span>
                          <span className={styles.paidDate}>
                            Pago em:{" "}
                            {new Date(p.paid_at).toLocaleDateString("pt-BR")}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className={styles.userAction}>
                    <PaymentStatusBadge status={p.payment_status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Card>
  );
}
