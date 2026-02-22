import { useEffect, useState } from "react";

import { I } from "../../../../components";
import { monthToString } from "../../../../utils";

import styles from "./styles.module.css";

interface UserMonthlyReportsProps {
  month: number;
}

export function UserMonthlyReports({ month }: UserMonthlyReportsProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {}, [isOpen]);

  return (
    <div className={styles.monthlyReportsCard}>
      <button
        className={styles.userReportsBoxButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <I.arrow_down /> : <I.arrow_up />}
      </button>
      <h4>{monthToString(month)}</h4>

      {isOpen && (
        <>
          <hr style={{ margin: "1rem 0", opacity: 0.2 }} />
          <ul className={styles.reportsList}></ul>
        </>
      )}
    </div>
  );
}
