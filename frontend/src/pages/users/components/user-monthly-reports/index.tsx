import { useEffect, useMemo, useState } from "react";

import { C, I, Loader } from "../../../../components";
import type { BusTripReport } from "../../../../types";
import { monthToString } from "../../../../utils";

import { UserReportCard } from "../user-report-card";

import styles from "./styles.module.css";

interface Props {
  month: number;
  onFetch: (month: number) => Promise<BusTripReport[]>;
}

export function UserMonthlyReports({ month, onFetch }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [reports, setReports] = useState<BusTripReport[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const stats = useMemo(() => {
    if (reports.length === 0) return null;
    return {
      presente: reports.filter((r) => r.marked && r.attended).length,
      falta: reports.filter((r) => r.marked && !r.attended).length,
      extra: reports.filter((r) => !r.marked && r.attended).length,
    };
  }, [reports]);

  const chartData = useMemo(
    () => ({
      labels: ["Presente", "Falta", "Extra"],
      datasets: [
        {
          data: stats ? [stats.presente, stats.falta, stats.extra] : [0, 0, 0],
          backgroundColor: stats
            ? ["#10b981", "#f59e0b", "#ef4444"]
            : ["#6366f1"],
          borderWidth: 0,
          label: "",
        },
      ],
    }),
    [stats],
  );

  useEffect(() => {
    if (isOpen && !hasLoaded) {
      setIsLoading(true);

      onFetch(month)
        .then((data) => {
          setReports(data);
          setHasLoaded(true);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [month, onFetch, isOpen, hasLoaded]);

  return (
    <div className={styles.monthlyReportsCard}>
      <div className={styles.header}>
        <h4>{monthToString(month)}</h4>
        <button
          className={styles.toggleButton}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <I.arrow_up /> : <I.arrow_down />}
        </button>
      </div>

      {isOpen && (
        <div className={styles.content}>
          {isLoading && <Loader />}

          {hasLoaded && !isLoading && reports.length > 0 && (
            <>
              <hr style={{ opacity: 0.2 }} />
              <div className={styles.infoGraph}>
                <C.pizza data={chartData} />
              </div>
              <ul className={styles.reportsList}>
                {reports.map((report, index) => (
                  <UserReportCard key={index} report={report} />
                ))}
              </ul>
            </>
          )}

          {hasLoaded && !isLoading && reports.length === 0 && (
            <>
              <hr style={{ opacity: 0.2 }} />
              <p className={styles.emptyMessage}>
                Nenhum relatório foi encontrado para este mês.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
