import { useEffect, useReducer } from "react";

import { useDeleteUserById, useUpdateUserById } from "../../../../hooks";
import { Card, ConfirmModal, Error, I, Input } from "../../../../components";
import type { User } from "../../../../types";

import { EditableField, UserActions } from "./components";

import styles from "./styles.module.css";

interface SelectedUserCardProps {
  selectedUser: User;
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
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "field":
      return { ...state, [action.payload.field]: action.payload.value };
    case "fillUser":
      return {
        ...state,
        ...action.payload,
        password: "",
        error: "",
      };
    default:
      return state;
  }
};

export function SelectedUserCard({ selectedUser }: SelectedUserCardProps) {
  const { updateUserById } = useUpdateUserById();
  const { deleteUserById } = useDeleteUserById();
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
      await updateUserById({
        id: selectedUser.id,
        user: {
          name,
          email,
          password: password || null,
          cpf,
          phone,
          address,
          cep,
          birth: new Date(birth),
        },
      });
      handleFieldChange("editMode", false);
    } catch {
      handleFieldChange("error", "Erro ao atualizar usuário.");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUserById(selectedUser.id);
      handleFieldChange("isDeleteModalOpen", false);
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
        onToggleEdit={() => handleFieldChange("editMode", !editMode)}
        onConfirmEdit={handleUpdate}
        onOpenDeleteModal={() => handleFieldChange("isDeleteModalOpen", true)}
      />

      <div className={styles.userPicture}>
        <I.user size={128} />
      </div>

      <div className={styles.userInfo}>
        {editMode ? (
          <Input
            label="Nome"
            name="name"
            type="text"
            placeholder="Digite o nome"
            required
            value={name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
          />
        ) : (
          <h1>{name}</h1>
        )}
        <hr />
        <div className={styles.userDetails}>
          <section>
            <EditableField
              label="Email"
              name="email"
              type="email"
              value={email}
              editMode={editMode}
              placeholder="Digite o email"
              onChange={(val) => handleFieldChange("email", val)}
            />
            <EditableField
              label="CPF"
              name="cpf"
              type="text"
              value={cpf}
              editMode={editMode}
              placeholder="Digite o CPF"
              onChange={(val) => handleFieldChange("cpf", val)}
            />
            <EditableField
              label="Telefone"
              name="phone"
              type="text"
              value={phone}
              editMode={editMode}
              placeholder="Digite o telefone"
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
              placeholder="Digite o endereço"
              onChange={(val) => handleFieldChange("address", val)}
            />
            <EditableField
              label="CEP"
              name="cep"
              type="text"
              value={cep}
              editMode={editMode}
              placeholder="Digite o CEP"
              onChange={(val) => handleFieldChange("cep", val)}
            />
            <EditableField
              label="Data de nascimento"
              name="birth"
              type="date"
              value={birth.split("/").reverse().join("-")}
              editMode={editMode}
              placeholder="Digite a data de nascimento"
              onChange={(val) => handleFieldChange("birth", val)}
            />
          </section>
        </div>

        {editMode && (
          <Input
            label="Nova Senha"
            name="password"
            type="password"
            placeholder="Digite nova senha"
            required
            value={password}
            onChange={(e) => handleFieldChange("password", e.target.value)}
          />
        )}

        {error && (
          <Error error={error} onClose={() => handleFieldChange("error", "")} />
        )}
      </div>
    </Card>
  );
}
