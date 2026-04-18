import { PageHeader } from "../../../../components";
import type { MonthlyFeeConfig } from "../../../../types";
import { months } from "../../../../utils";

import styles from "./styles.module.css";

interface FeeConfigDetailsCardProps {
  config: MonthlyFeeConfig;
  isEmmitable: boolean;
  canDelete: boolean;
  onClickEmit: () => void;
  onClickDelete: () => void;
}

export function FeeConfigDetailsCard({
  config,
  isEmmitable,
  canDelete,
  onClickEmit,
  onClickDelete,
}: FeeConfigDetailsCardProps) {
  const formatCurrency = (value: number) =>
    (value / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className={styles.detailsCard}>
      <header className={styles.cardHeader}>
        <PageHeader
          title="Detalhes da Cobrança"
          description="Configuração de taxas e prazos para este período"
        />

        <div className={styles.cardHeaderActions}>
          <span className={styles.monthTag}>
            {months[config.month - 1]} / {config.year}
          </span>
          <div className={styles.actionButtons}>
            {isEmmitable && (
              <button className="btn-sm btn-info" onClick={onClickEmit}>
                Emitir Pagamentos
              </button>
            )}
            {canDelete && (
              <button className="btn-sm btn-danger" onClick={onClickDelete}>
                Excluir
              </button>
            )}
          </div>
        </div>
      </header>

      <hr />

      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Data de Vencimento</span>
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
