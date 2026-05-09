import { useState } from "react";

import { Modal } from "../";
import { Loader } from "../../loader";

import styles from "./styles.module.css";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  className,
  onConfirm,
  title = "Confirmar ação",
  description = "Tem certeza que deseja realizar essa ação? Esta ação pode ser irreversível.",
}: ConfirmModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={className}>
      <div className={styles.modalContent}>
        <h1>{title}</h1>
        <hr />
        <p>{description}</p>

        <div className={styles.buttons}>
          <button
            type="button"
            className={`${styles.btnSecondary} btn`}
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? <Loader color="white" /> : "Confirmar"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
