import { useState } from "react";

import { Card, I } from "../../../../components";
import type { BusTripReport } from "../../../../types";

import styles from "./styles.module.css";

interface BusReportsCardProps {
  reports: BusTripReport[];
}

export function BusReportsCard({ reports }: BusReportsCardProps) {
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  return (
    <Card className={styles.reportsBox}>
      <button
        className={styles.reportsBoxButton}
        onClick={() => setIsReportsOpen(!isReportsOpen)}
      >
        {isReportsOpen ? <I.arrow_back /> : <I.arrow_up />}
      </button>
      <h2>Relatórios</h2>
      {isReportsOpen && (
        <ul className={styles.reportsList}>
          {reports.map((report) => (
            <li key={report.id}>
              <Card>{report.user_name}</Card>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
