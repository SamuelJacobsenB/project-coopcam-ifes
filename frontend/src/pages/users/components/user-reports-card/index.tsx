import { useState } from "react";

import { Card, I } from "../../../../components";
import type { BusTripReport } from "../../../../types";

import { UserMonthlyReports } from "../user-monthly-reports";

import styles from "./styles.module.css";

interface UserReportsCardProps {
  handleFetch: (month: number) => Promise<BusTripReport[]>;
}

export function UserReportsCard({ handleFetch }: UserReportsCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <Card className={styles.userReportsBox}>
      <button
        className={styles.userReportsBoxButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <I.arrow_down /> : <I.arrow_up />}
      </button>
      <h2>Relatórios</h2>

      {isOpen && (
        <>
          <hr />
          <ul className={styles.monthList}>
            {months.map((month) => (
              <li key={month}>
                <UserMonthlyReports month={month} onFetch={handleFetch} />
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
