import { Loader } from "../../";

import styles from "./styles.module.css";

export function LoadPage() {
  return (
    <div className={styles.load_page}>
      <Loader color="white" />
    </div>
  );
}
