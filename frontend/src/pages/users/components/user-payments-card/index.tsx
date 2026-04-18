import { useEffect, useState } from "react";

import { Card, I, Loader, PaymentCard } from "../../../../components";

import type { MonthlyPayment } from "../../../../types";
import { monthToString } from "../../../../utils";

import styles from "./styles.module.css";

interface UserPaymentsCardProps {
  handleFetch: () => Promise<MonthlyPayment[]>;
}

export function UserPaymentsCard({ handleFetch }: UserPaymentsCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [payments, setPayments] = useState<MonthlyPayment[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    handleFetch()
      .then((payments: MonthlyPayment[]) => {
        setPayments(payments);
      })
      .finally(() => setIsLoading(false));
  }, [handleFetch]);

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
          <hr />
          {isLoading && <Loader />}
          {!isLoading && payments?.length === 0 && (
            <p style={{ textAlign: "center", opacity: 0.5 }}>
              Nenhum pagamento encontrado.
            </p>
          )}
          {!isLoading && payments?.length !== 0 && (
            <ul className={styles.userPaymentsList}>
              {payments?.map((p) => (
                <li key={p.id}>
                  <PaymentCard
                    monthly_payment={p}
                    main_info={p.year + " / " + monthToString(p.month)}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </Card>
  );
}
