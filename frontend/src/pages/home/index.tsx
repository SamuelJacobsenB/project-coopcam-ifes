import { Navbar, Private } from "../../components";

import styles from "./styles.module.css";

export function DashboardPage() {
  return (
    <Private>
      <Navbar />
      <div className={styles.container}>
        <h1>Análise diária</h1>
        <ul className={styles.list}></ul>
      </div>
    </Private>
  );
}
