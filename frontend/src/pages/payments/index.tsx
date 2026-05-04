import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ConfirmModal,
  DualPage,
  EmptyState,
  I,
  MonthlyFeeItemCard,
  Navbar,
  PageHeader,
  Private,
} from "../../components";
import { useMessage } from "../../contexts";
import {
  useDeleteMonthlyFeeConfigById,
  useEmitMonthlyPaymentBatch,
  useManyByPeriod,
  useManyMonthlyFeeConfigByYear,
} from "../../hooks";
import type { MonthlyFeeConfig, MonthlyPayment } from "../../types";

import { FeeConfigDetailsCard, UserPaymentsCard } from "./components";

import styles from "./styles.module.css";

export function PaymentsPage() {
  const { showMessage } = useMessage();

  const { getMonthlyFeeConfigByYear } = useManyMonthlyFeeConfigByYear();
  const { getManyByPeriod } = useManyByPeriod();
  const { emitMonthlyPaymentBatch } = useEmitMonthlyPaymentBatch();
  const { deleteMonthlyFeeConfigById } = useDeleteMonthlyFeeConfigById();

  const [isEmitModalOpen, setIsEmitModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyFeeConfigs, setMonthlyFeeConfigs] = useState<
    MonthlyFeeConfig[]
  >([]);
  const [selectedConfig, setSelectedConfig] = useState<MonthlyFeeConfig | null>(
    null,
  );
  const [payments, setPayments] = useState<MonthlyPayment[]>([]);

  const { canEmit, canDelete } = useMemo(() => {
    const isAllDraft =
      payments.length > 0 &&
      payments.every((p) => p.payment_status === "draft");
    return {
      canEmit: isAllDraft,
      canDelete: payments.length === 0 || isAllDraft,
    };
  }, [payments]);

  const handleEmitBatch = async () => {
    if (!selectedConfig || !canEmit) return;

    try {
      await emitMonthlyPaymentBatch({
        month: selectedConfig.month,
        year: selectedConfig.year,
      });

      setPayments((prev) =>
        prev.map((p) => ({ ...p, payment_status: "pending" })),
      );
      setIsEmitModalOpen(false);
      showMessage("Pagamentos emitidos com sucesso", "success");
    } catch {
      showMessage("Erro ao emitir pagamentos", "error");
    }
  };

  const handleDelete = async () => {
    if (!selectedConfig || !canDelete) return;

    try {
      await deleteMonthlyFeeConfigById(selectedConfig.id);

      setMonthlyFeeConfigs((prev) =>
        prev.filter((c) => c.id !== selectedConfig.id),
      );
      setSelectedConfig(null);
      setPayments([]);
      setIsDeleteModalOpen(false);
      showMessage("Configuração deletada com sucesso", "success");
    } catch {
      showMessage("Erro ao deletar configuração", "error");
    }
  };

  useEffect(() => {
    getMonthlyFeeConfigByYear(year).then((data) => setMonthlyFeeConfigs(data));
    setSelectedConfig(null);
    setPayments([]);
  }, [getMonthlyFeeConfigByYear, year]);

  useEffect(() => {
    if (selectedConfig) {
      getManyByPeriod({
        month: selectedConfig.month,
        year: selectedConfig.year,
      })
        .then((data) => setPayments(data || []))
        .catch(() => setPayments([]));
    }
  }, [selectedConfig, getManyByPeriod]);

  return (
    <Private>
      <Navbar />
      <DualPage
        leftSide={
          <aside className={styles.leftContainer}>
            <header className={styles.header}>
              <PageHeader
                title="Pagamentos"
                description="Gerencie mensalidades"
              />
              <Link
                to="/pagamentos/criar"
                className={`btn-sm btn-primary ${styles.createBtn}`}
              >
                Novo
              </Link>
            </header>

            <hr />

            <nav className={styles.yearSelector} aria-label="Seletor de ano">
              <button
                onClick={() => setYear((y) => y - 1)}
                className={styles.yearBtn}
                aria-label="Ano anterior"
              >
                <I.arrow_back />
              </button>
              <h2>{year}</h2>
              <button
                onClick={() => setYear((y) => y + 1)}
                className={styles.yearBtn}
                aria-label="Próximo ano"
              >
                <I.arrow_forward />
              </button>
            </nav>

            {monthlyFeeConfigs.length > 0 ? (
              <ul
                className={styles.list}
                aria-label="Lista de meses configurados"
              >
                {monthlyFeeConfigs.map((config) => (
                  <li key={config.id}>
                    <MonthlyFeeItemCard
                      month={config.month}
                      isSelected={config.id === selectedConfig?.id}
                      onClick={() => setSelectedConfig(config)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptySidebar}>
                Nenhuma configuração encontrada para {year}
              </p>
            )}
          </aside>
        }
        rightSide={
          <main className={styles.rightContainer}>
            {selectedConfig ? (
              <div className={styles.rightContentScroll}>
                <FeeConfigDetailsCard
                  config={selectedConfig}
                  isEmmitable={canEmit}
                  canDelete={canDelete}
                  onClickEmit={() => setIsEmitModalOpen(true)}
                  onClickDelete={() => setIsDeleteModalOpen(true)}
                />
                <UserPaymentsCard payments={payments} />
              </div>
            ) : (
              <EmptyState
                icon="calendar"
                title="Selecione um mês"
                description="Escolha uma configuração na lista à esquerda para gerir os pagamentos."
              />
            )}
          </main>
        }
      />

      <ConfirmModal
        title="Emitir Pagamentos"
        description="Você deseja emitir os pagamentos para este mês? Após a emissão, os boletos serão gerados e você não poderá mais excluir esta configuração."
        isOpen={isEmitModalOpen}
        onClose={() => setIsEmitModalOpen(false)}
        onConfirm={handleEmitBatch}
      />

      <ConfirmModal
        title="Deletar Configuração"
        description="Tem certeza que deseja deletar esta configuração de taxa mensal? Esta ação é irreversível."
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </Private>
  );
}
