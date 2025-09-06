import { I } from "../../icons";

import styles from "./styles.module.css";

interface ErrorProps {
  error: string;
  onClose: () => void;
}

export function Error({ error, onClose }: ErrorProps) {
  if (!error) return null;

  return (
    <div className={styles.error}>
      <p>{error}</p>
      <button type="button" onClick={onClose} className={styles.close}>
        <I.close />
      </button>
    </div>
  );
}
