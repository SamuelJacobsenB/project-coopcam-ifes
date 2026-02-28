import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { DualPage, I, Navbar, Private } from "../../components";
import { useManyByPeriod, useManyMonthlyFeeConfigByYear } from "../../hooks";
import type { MonthlyFeeConfig, MonthlyPayment } from "../../types";

import {
  FeeConfigDetailsCard,
  MonthlyFeeItem,
  UserPaymentsCard,
} from "./components";
import styles from "./styles.module.css";

export function PaymentsPage() {
  const { getMonthlyFeeConfigByYear } = useManyMonthlyFeeConfigByYear();
  const { getManyByPeriod } = useManyByPeriod();

  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyFeeConfigs, setMonthlyFeeConfigs] = useState<
    MonthlyFeeConfig[]
  >([]);
  const [selectedConfig, setSelectedConfig] = useState<MonthlyFeeConfig | null>(
    null,
  );
  const [payments, setPayments] = useState<MonthlyPayment[]>([]);

  useEffect(() => {
    getMonthlyFeeConfigByYear(year).then((data) => setMonthlyFeeConfigs(data));
    setSelectedConfig(null);
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
          <div className={styles.leftContainer}>
            <header className={styles.headerRow}>
              <div className={styles.headerText}>
                <h1>Pagamentos</h1>
                <p>Gerencie pagamentos</p>
              </div>
              <Link
                to="/pagamentos/criar"
                className={`btn-sm btn-primary ${styles.createBtn}`}
              >
                Novo
              </Link>
            </header>

            <div className={styles.yearSelector}>
              <button onClick={() => setYear((y) => y - 1)}>
                <I.arrow_back />
              </button>
              <h2>{year}</h2>
              <button onClick={() => setYear((y) => y + 1)}>
                <I.arrow_forward />
              </button>
            </div>

            {monthlyFeeConfigs.length > 0 ? (
              <ul className={styles.list}>
                {monthlyFeeConfigs.map((config) => (
                  <li key={config.id}>
                    <MonthlyFeeItem
                      month={config.month}
                      isSelected={config.id === selectedConfig?.id}
                      onClick={() => setSelectedConfig(config)}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyState}>
                Nenhuma configuração de taxa encontrada
              </p>
            )}
          </div>
        }
        rightSide={
          <div className={styles.rightContainer}>
            {selectedConfig ? (
              <div className={styles.rightContentScroll}>
                <FeeConfigDetailsCard config={selectedConfig} />
                <UserPaymentsCard payments={payments} />
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        }
      />
    </Private>
  );
}

const EmptyState = () => (
  <div className={styles.rightPlaceholder}>
    <I.calendar size={48} color="#ccc" style={{ marginBottom: "1rem" }} />
    <h2>Selecione um mês</h2>
    <p>Selecione um mês para gerir os pagamentos e a configuração de taxa.</p>
  </div>
);
