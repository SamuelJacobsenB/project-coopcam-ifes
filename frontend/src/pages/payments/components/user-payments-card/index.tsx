import type { MonthlyPayment } from "../../../../types";

import styles from "./styles.module.css";

interface UserPaymentsCardProps {
  payments: MonthlyPayment[];
}

export function UserPaymentsCard({ payments }: UserPaymentsCardProps) {
  const paidCount = payments.filter((p) => p.payment_status === "paid").length;
  const totalAmount = payments.reduce((acc, p) => acc + p.amount, 0);

  const renderStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; class: string }> = {
      paid: { label: "Pago", class: styles.statusPaid },
      pending: { label: "Pendente", class: styles.statusPending },
      draft: { label: "Rascunho", class: styles.statusDraft },
      overdue: { label: "Atrasado", class: styles.statusOverdue },
      cenceled: { label: "Cancelado", class: styles.statusCanceled },
      failed: { label: "Falhou", class: styles.statusFailed },
      refunded: { label: "Reembolsado", class: styles.statusRefunded },
    };

    const config = statusMap[status] || { label: status, class: "" };
    return (
      <span className={`${styles.statusBadge} ${config.class}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className={styles.detailsCard}>
      <header className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Status de Pagamento</h2>
          <p className={styles.cardSubtitle}>
            Gestão de recebimentos e inadimplência
          </p>
        </div>
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

      {payments.length > 0 ? (
        <div className={styles.listContainer}>
          <ul className={styles.usersList}>
            {payments.map((p) => (
              <li key={p.id} className={styles.userListItem}>
                <div className={styles.userInfo}>
                  <div className={styles.userMainInfo}>
                    <strong>{p.user_name}</strong>
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
                  {renderStatusBadge(p.payment_status)}
                </div>
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
