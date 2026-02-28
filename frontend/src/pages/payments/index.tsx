import { useState } from "react";
import { Link } from "react-router-dom";

import { DualPage, Navbar, Private } from "../../components";

import styles from "./styles.module.css";

export function PaymentsPage() {
  const currentYear = Date.now().toLocaleString().split("/")[2];
  const [year, setYear] = useState(currentYear);

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
          </div>
        }
        rightSide={<div className={styles.rightContainer}></div>}
      />
    </Private>
  );
}
