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
    <div
      className={styles.background}
      onClick={onClose} // Fecha ao clicar no fundo
    >
      <div
        className={styles.modalArea}
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal feche ele
      >
        <button
          type="button"
          onClick={onClose}
          className={styles.close}
          aria-label="Fechar modal"
        >
          <I.close size={20} />
        </button>
        <Card className={`${styles.modal} ${className}`}>{children}</Card>
      </div>
    </div>
  );
}
