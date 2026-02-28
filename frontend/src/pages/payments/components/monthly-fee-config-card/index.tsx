import type { MonthlyFeeConfig } from "../../../../types";
import { months } from "../../../../utils";

import styles from "./styles.module.css";

interface Props {
  config: MonthlyFeeConfig;
}

export function FeeConfigDetailsCard({ config }: Props) {
  const formatCurrency = (value: number) =>
    (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className={styles.detailsCard}>
      <header className={styles.cardHeader}>
        <div>
          <h2 className={styles.cardTitle}>Detalhes da Cobrança</h2>
          <p className={styles.cardSubtitle}>
            Informações gerais da taxa configurada
          </p>
        </div>
        <span className={styles.monthTag}>
          {months[config.month - 1]} / {config.year}
        </span>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Vencimento</span>
          <strong className={styles.statValue}>
            {new Date(config.due_date).toLocaleDateString("pt-BR")}
          </strong>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Valor Base</span>
          <strong className={styles.statValue}>
            {formatCurrency(config.base_amount)}
          </strong>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Valor com Auxílio</span>
          <strong className={styles.statValue}>
            {formatCurrency(config.financial_aid_amount)}
          </strong>
        </div>
      </div>
    </div>
  );
}
