import styles from "./styles.module.css";

interface UserActionsProps {
  editMode: boolean;
  onToggleEdit: () => void;
  onConfirmEdit: () => void;
  onOpenDeleteModal: () => void;
}

export function UserActions({
  editMode,
  onToggleEdit,
  onConfirmEdit,
  onOpenDeleteModal,
}: UserActionsProps) {
  return (
    <div className={styles.actions}>
      {editMode && (
        <button className="btn-sm btn-success" onClick={onConfirmEdit}>
          Concluir
        </button>
      )}
      <button className="btn-sm btn-info" onClick={onToggleEdit}>
        {editMode ? "Cancelar" : "Editar"}
      </button>
      <button className="btn-sm btn-danger" onClick={onOpenDeleteModal}>
        Deletar
      </button>
    </div>
  );
}
