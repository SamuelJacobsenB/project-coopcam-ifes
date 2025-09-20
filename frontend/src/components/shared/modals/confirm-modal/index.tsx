import { Modal } from "../";

import styles from "./styles.module.css";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  onConfirm: () => Promise<void>;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  className,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className={className}>
      <h1>Confirmar ação</h1>
      <hr />
      <p>
        Tem certeza que deseja realizar essa ação? Esta ação pode ser
        irreversível.
      </p>
      <div className={styles.buttons}>
        <button
          type="button"
          className="btn btn-success"
          onClick={async () => {
            await onConfirm();
            onClose();
          }}
        >
          Confirmar
        </button>
        <button type="button" className="btn btn-danger" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </Modal>
  );
};
