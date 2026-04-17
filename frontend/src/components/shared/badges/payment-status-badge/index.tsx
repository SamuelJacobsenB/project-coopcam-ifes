import styles from "./styles.module.css";

interface PaymentStatusBadgeProps {
  status: string;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
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
}
