import { useState } from "react";

import { ConfirmModal } from "../../../../../../components";
import { useMessage } from "../../../../../../contexts";
import {
  useDeleteUserById,
  useDemoteUser,
  usePromoteUser,
  useUpdateUserById,
} from "../../../../../../hooks";
import type { User, UserUpdateDTO } from "../../../../../../types";

import { useQueryClient } from "@tanstack/react-query";
import styles from "./styles.module.css";

interface UserActionsProps {
  editMode: boolean;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;

  currentUserData: UserUpdateDTO;

  onToggleEdit: () => void;
}

export function UserActions({
  editMode,
  selectedUser,
  setSelectedUser,

  currentUserData,

  onToggleEdit,
}: UserActionsProps) {
  const queryClient = useQueryClient();

  const { showMessage } = useMessage();

  const { updateUserById } = useUpdateUserById();
  const { deleteUserById } = useDeleteUserById();
  const { promoteUser } = usePromoteUser();
  const { demoteUser } = useDemoteUser();

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  }>({ isOpen: false, title: "", description: "", onConfirm: async () => {} });

  const handleUpdate = async () => {
    try {
      if (!selectedUser) return;

      const updatedUser = await updateUserById({
        id: selectedUser.id,
        user: currentUserData,
      });

      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", selectedUser.id] });

      setSelectedUser(updatedUser);
      showMessage("Usuário atualizado com sucesso", "success");
    } catch {
      showMessage("Erro ao atualizar usuário", "error");
    }
  };

  const handleDelete = async () => {
    try {
      if (!selectedUser) return;

      await deleteUserById(selectedUser.id);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSelectedUser(null);
      showMessage("Usuário deletado com sucesso", "success");
    } catch {
      showMessage("Erro ao deletar usuário", "error");
    }
  };

  const handlePromote = async (role: "driver" | "admin") => {
    try {
      if (!selectedUser) return;

      await promoteUser({ user_id: selectedUser.id, targetRole: role });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", selectedUser.id] });
      setSelectedUser({ ...selectedUser, role });
      showMessage(`Usuário promovido para ${role} com sucesso`, "success");
    } catch {
      showMessage("Erro ao promover usuário", "error");
    }
  };

  const handleDemote = async () => {
    try {
      if (!selectedUser) return;

      await demoteUser(selectedUser.id);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", selectedUser.id] });
      setSelectedUser({ ...selectedUser, role: "user" });
      showMessage("Privilégios removidos com sucesso", "success");
    } catch {
      showMessage("Erro ao rebaixar usuário", "error");
    }
  };

  const openConfirm = (
    title: string,
    description: string,
    action: () => Promise<void>,
  ) => {
    setModalConfig({ isOpen: true, title, description, onConfirm: action });
  };

  if (!selectedUser) return null;

  return (
    <div className={styles.actions}>
      {!editMode && (
        <>
          {selectedUser.role === "user" ? (
            <>
              <button
                className="btn-sm btn-warning"
                onClick={() =>
                  openConfirm(
                    "Promover para Motorista",
                    `Deseja tornar ${selectedUser.name} um motorista?`,
                    () => handlePromote("driver"),
                  )
                }
              >
                Promover para Motorista
              </button>
              <button
                className="btn-sm btn-warning"
                onClick={() =>
                  openConfirm(
                    "Promover para Admin",
                    `Deseja dar privilégios de Administrador para ${selectedUser.name}?`,
                    () => handlePromote("admin"),
                  )
                }
              >
                Promover para Administrador
              </button>
            </>
          ) : (
            <button
              className="btn-sm btn-warning"
              onClick={() =>
                openConfirm(
                  "Remover Privilégios",
                  `Deseja rebaixar ${selectedUser.name} para usuário comum?`,
                  handleDemote,
                )
              }
            >
              Rebaixar a Usuário
            </button>
          )}
        </>
      )}

      {editMode && (
        <button
          className="btn-sm btn-success"
          onClick={() => {
            openConfirm(
              "Salvar Alterações",
              `Deseja salvar as alterações feitas em ${selectedUser.name}?`,
              handleUpdate,
            );
          }}
        >
          Concluir
        </button>
      )}

      <button className="btn-sm btn-info" onClick={onToggleEdit}>
        {editMode ? "Cancelar" : "Editar"}
      </button>

      <button
        className="btn-sm btn-danger"
        onClick={() => {
          openConfirm(
            "Deletar Usuário",
            `Deseja deletar ${selectedUser.name} e todos os seus dados? Essa ação pode ser irreversível`,
            handleDelete,
          );
        }}
      >
        Deletar
      </button>

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        description={modalConfig.description}
        onConfirm={async () => {
          await modalConfig.onConfirm();
          setModalConfig({ ...modalConfig, isOpen: false });
        }}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
      />
    </div>
  );
}
