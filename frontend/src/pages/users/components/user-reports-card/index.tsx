import { useState } from "react";

import { Card, I } from "../../../../components";

import { UserMonthlyReports } from "../user-monthly-reports";
import styles from "./styles.module.css";

export function UserReportsCard() {
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
          <hr style={{ margin: "1rem 0", opacity: 0.2 }} />
          <ul className={styles.monthList}>
            {months.map((month) => (
              <li key={month}>
                <UserMonthlyReports month={month} />
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
