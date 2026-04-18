import { PageHeader, PaymentCard } from "../../../../components";
import type { MonthlyPayment } from "../../../../types";

import styles from "./styles.module.css";

interface UserPaymentsCardProps {
  payments: MonthlyPayment[];
}

export function UserPaymentsCard({ payments }: UserPaymentsCardProps) {
  const paidCount = payments.filter((p) => p.payment_status === "paid").length;
  const totalAmount = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className={styles.detailsCard}>
      <header className={styles.cardHeader}>
        <PageHeader
          title="Status de Pagamento"
          description="Gestão de recebimentos e pendências"
        />

        <div className={styles.summaryBadges}>
          <span className={styles.badgeSuccess}>
            {paidCount} de {payments.length} pagos
          </span>
          <span className={styles.badgeCount}>
            {totalAmount.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}{" "}
            esperado
          </span>
        </div>
      </header>

      <hr />

      {payments.length > 0 ? (
        <div className={styles.listContainer}>
          <ul className={styles.usersList}>
            {payments.map((p) => (
              <li key={p.id}>
                <PaymentCard monthly_payment={p} main_info={p.user_name} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={styles.emptyList}>
          <p>Nenhum registro de pagamento encontrado.</p>
        </div>
      )}
    </div>
  );
}
