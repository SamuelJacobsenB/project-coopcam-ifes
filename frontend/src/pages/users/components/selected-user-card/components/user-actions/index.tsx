import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { ConfirmModal } from "../../../../../../components";
import { useMessage } from "../../../../../../contexts";
import {
  useDeleteUserById,
  useDemoteUser,
  usePromoteUser,
  useUpdateUserById,
} from "../../../../../../hooks";
import { getErrorMessage } from "../../../../../../services";
import type { User, UserUpdateDTO } from "../../../../../../types";
import { validateUserUpdateDTO } from "../../../../../../utils";

import styles from "./styles.module.css";

interface UserActionsProps {
  editMode: boolean;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  currentUserData: UserUpdateDTO;
  setError: (error: string) => void;
  onToggleEdit: () => void;
}

interface ModalConfig {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => Promise<void>;
}

export function UserActions({
  editMode,
  selectedUser,
  setSelectedUser,
  currentUserData,
  setError,
  onToggleEdit,
}: UserActionsProps) {
  const queryClient = useQueryClient();
  const { showMessage } = useMessage();

  const [modal, setModal] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: async () => {},
  });

  const { updateUserById } = useUpdateUserById();
  const { deleteUserById } = useDeleteUserById();
  const { promoteUser } = usePromoteUser();
  const { demoteUser } = useDemoteUser();

  if (!selectedUser) return null;

  const { id, name, role } = selectedUser;

  const execute = async <T,>(
    fn: () => Promise<T>,
    msg: string,
  ): Promise<T | undefined> => {
    try {
      const result = await fn();

      await queryClient.invalidateQueries({ queryKey: ["users"] });
      await queryClient.invalidateQueries({ queryKey: ["user", id] });

      if (msg) showMessage(msg, "success");
      return result;
    } catch (err) {
      setError(getErrorMessage(err));
      return undefined;
    } finally {
      setModal((p) => ({ ...p, isOpen: false }));
    }
  };

  const confirm = (
    title: string,
    desc: string,
    onConfirm: () => Promise<void>,
  ) => setModal({ isOpen: true, title, description: desc, onConfirm });

  const handleUpdate = () =>
    confirm("Salvar", `Salvar alterações de ${name}?`, async () => {
      const err = validateUserUpdateDTO(currentUserData);
      if (err) {
        setError(err);
        return;
      }

      const updated = await execute(
        () => updateUserById({ id, user: currentUserData }),
        "Usuário atualizado",
      );
      if (updated) setSelectedUser(updated);
    });

  const handleDelete = () =>
    confirm(
      "Deletar",
      `Deseja excluir ${name} e todas as suas informações permanentemente?`,
      async () => {
        await execute(async () => {
          await deleteUserById(id);
          setSelectedUser(null);
        }, "Usuário deletado");
      },
    );

  return (
    <div className={styles.actions}>
      {!editMode ? (
        <>
          {role === "user" ? (
            <>
              <button
                className="btn-sm btn-warning"
                onClick={() =>
                  confirm(
                    "Promover",
                    "Deseja promover usuário a motorista?",
                    async () => {
                      await execute(
                        () => promoteUser({ userId: id, targetRole: "driver" }),
                        "Usuário promovido",
                      );
                    },
                  )
                }
              >
                Motorista
              </button>
              <button
                className="btn-sm btn-warning"
                onClick={() =>
                  confirm(
                    "Promover",
                    "Deseja promover usuário a administrador?",
                    async () => {
                      await execute(
                        () => promoteUser({ userId: id, targetRole: "admin" }),
                        "Usuário promovido",
                      );
                    },
                  )
                }
              >
                Admin
              </button>
            </>
          ) : (
            <button
              className="btn-sm btn-warning"
              onClick={() =>
                confirm("Rebaixar", "Deseja rebaixar usuário?", async () => {
                  await execute(() => demoteUser(id), "Privilégios removidos");
                })
              }
            >
              Rebaixar
            </button>
          )}
        </>
      ) : (
        <button className="btn-sm btn-success" onClick={handleUpdate}>
          Concluir
        </button>
      )}

      <button className="btn-sm btn-info" onClick={onToggleEdit}>
        {editMode ? "Cancelar" : "Editar"}
      </button>

      <button className="btn-sm btn-danger" onClick={handleDelete}>
        Deletar
      </button>

      <ConfirmModal
        {...modal}
        onClose={() => setModal((p) => ({ ...p, isOpen: false }))}
      />
    </div>
  );
}
