import { I, Card } from "../../../";

import styles from "./styles.module.css";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function Modal({ children, isOpen, onClose, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.background}>
      <div className={styles.modalArea}>
        <button type="button" onClick={onClose} className={styles.close}>
          <I.close />
        </button>
        <Card className={`${styles.modal} ${className}`}>{children}</Card>
      </div>
    </div>
  );
}
