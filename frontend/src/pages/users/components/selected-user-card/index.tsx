import { useEffect, useReducer } from "react";

import { Card, ConfirmModal, Error, I, Input } from "../../../../components";
import { useMessage } from "../../../../contexts";
import { useDeleteUserById, useUpdateUserById } from "../../../../hooks";
import type { User } from "../../../../types";

import { EditableField, UserActions } from "./components";

import { Checkbox } from "../../../../components/shared/checkbox";
import { formatCEP, formatCPF } from "../../../../utils";
import styles from "./styles.module.css";

interface SelectedUserCardProps {
  selectedUser: User;
  setSelectedUser: (user: User) => void;
}

interface State {
  editMode: boolean;
  isDeleteModalOpen: boolean;
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  address: string;
  cep: string;
  birth: string;
  error: string;
  has_financial_aid: boolean;
}

type Action =
  | { type: "field"; payload: { field: keyof State; value: string | boolean } }
  | { type: "fillUser"; payload: User };

const initialState: State = {
  editMode: false,
  isDeleteModalOpen: false,
  name: "",
  email: "",
  password: "",
  cpf: "",
  phone: "",
  address: "",
  cep: "",
  birth: "",
  error: "",
  has_financial_aid: false,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "field":
      return { ...state, [action.payload.field]: action.payload.value };
    case "fillUser":
      return {
        ...state,
        ...action.payload,
        editMode: false,
        password: "",
        error: "",
      };
    default:
      return state;
  }
};

export function SelectedUserCard({
  selectedUser,
  setSelectedUser,
}: SelectedUserCardProps) {
  const { updateUserById } = useUpdateUserById();
  const { deleteUserById } = useDeleteUserById();

  const { showMessage } = useMessage();

  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    editMode,
    isDeleteModalOpen,
    name,
    email,
    password,
    cpf,
    phone,
    address,
    cep,
    birth,
    has_financial_aid,
    error,
  } = state;

  useEffect(() => {
    if (selectedUser) {
      dispatch({ type: "fillUser", payload: selectedUser });
    }
  }, [selectedUser]);

  const handleFieldChange = (field: keyof State, value: string | boolean) => {
    dispatch({ type: "field", payload: { field, value } });
  };

  const handleUpdate = async () => {
    try {
      const dateParts = birth.split("-");
      const adjustedDate = new Date(
        Number(dateParts[0]),
        Number(dateParts[1]) - 1,
        Number(dateParts[2]),
        12,
        0,
        0,
      );

      const updatedUser = await updateUserById({
        id: selectedUser.id,
        user: {
          name,
          email,
          password: password || null,
          cpf,
          phone,
          address,
          cep,
          birth: adjustedDate,
          has_financial_aid,
        },
      });

      setSelectedUser(updatedUser);

      dispatch({ type: "fillUser", payload: updatedUser });

      showMessage("Usuário atualizado com sucesso", "success");
    } catch {
      handleFieldChange("error", "Erro ao atualizar usuário.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUserById(selectedUser.id);
      handleFieldChange("isDeleteModalOpen", false);
      showMessage("Usuário deletado com sucesso", "success");
    } catch {
      handleFieldChange("error", "Erro ao deletar usuário.");
    }
  };

  return (
    <Card className={styles.selectedUserBox}>
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => handleFieldChange("isDeleteModalOpen", false)}
        onConfirm={handleDelete}
      />

      <UserActions
        editMode={editMode}
        onToggleEdit={() => {
          if (editMode) {
            dispatch({ type: "fillUser", payload: selectedUser });
          } else {
            handleFieldChange("editMode", true);
          }
        }}
        onConfirmEdit={handleUpdate}
        onOpenDeleteModal={() => handleFieldChange("isDeleteModalOpen", true)}
      />

      <header className={styles.userHeader}>
        <div className={styles.userPicture}>
          <I.user size={80} color="#64748b" />
        </div>

        <div className={styles.userTitleInfo}>
          {editMode ? (
            <Input
              label="Nome Completo"
              name="name"
              type="text"
              value={name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              required
            />
          ) : (
            <h1>{name}</h1>
          )}
        </div>
      </header>

      <hr />

      <div className={styles.userInfo}>
        <div className={styles.userDetails}>
          <section>
            <EditableField
              label="Email"
              name="email"
              type="email"
              value={email}
              editMode={editMode}
              onChange={(val) => handleFieldChange("email", val)}
            />
            <EditableField
              label="CPF"
              name="cpf"
              type="text"
              value={formatCPF(cpf)}
              editMode={editMode}
              onChange={(val) =>
                handleFieldChange("cpf", val.replace(".", "").replace("-", ""))
              }
            />
            <EditableField
              label="Telefone"
              name="phone"
              type="text"
              value={phone}
              editMode={editMode}
              onChange={(val) => handleFieldChange("phone", val)}
            />
          </section>

          <section>
            <EditableField
              label="Endereço"
              name="address"
              type="text"
              value={address}
              editMode={editMode}
              onChange={(val) => handleFieldChange("address", val)}
            />
            <EditableField
              label="Código Postal (CEP)"
              name="cep"
              type="text"
              value={formatCEP(cep)}
              editMode={editMode}
              onChange={(val) => handleFieldChange("cep", val.replace("-", ""))}
            />
            <EditableField
              label="Data de Nascimento"
              name="birth"
              type="date"
              value={birth}
              editMode={editMode}
              onChange={(val) => handleFieldChange("birth", val)}
            />
            <Checkbox
              label="Recebe auxílio financeiro"
              checked={has_financial_aid}
              disabled={!editMode}
              onChange={(e) =>
                handleFieldChange("has_financial_aid", e.target.checked)
              }
            />
          </section>
        </div>

        {editMode && (
          <div style={{ marginTop: "1rem" }}>
            <Input
              label="Redefinir Senha"
              name="password"
              type="password"
              placeholder="Deixe em branco para manter a atual"
              value={password}
              onChange={(e) => handleFieldChange("password", e.target.value)}
            />
          </div>
        )}

        {error && (
          <div className={styles.errorContainer}>
            <Error
              error={error}
              onClose={() => handleFieldChange("error", "")}
            />
          </div>
        )}
      </div>
    </Card>
  );
}
