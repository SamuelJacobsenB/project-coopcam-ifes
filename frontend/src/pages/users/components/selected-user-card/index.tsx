import { useEffect, useReducer } from "react";

import { Card, Checkbox, Error, I, Input } from "../../../../components";
import type { User } from "../../../../types";
import { formatCEP, formatCPF, formatPhone } from "../../../../utils";
import { EditableField, UserActions } from "./components";

import styles from "./styles.module.css";

interface SelectedUserCardProps {
  selectedUser: User;
  setSelectedUser: (user: User | null) => void;
}

interface State {
  editMode: boolean;
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
        birth: action.payload.birth.toString(),
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
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    editMode,
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
      dispatch({
        type: "fillUser",
        payload: selectedUser,
      });
    }
  }, [selectedUser]);

  const handleFieldChange = (field: keyof State, value: string | boolean) => {
    dispatch({ type: "field", payload: { field, value } });
  };

  return (
    <Card className={styles.selectedUserBox}>
      <UserActions
        editMode={editMode}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        currentUserData={{
          name,
          email,
          password: password || "",
          cpf,
          phone,
          address,
          cep,
          birth: new Date(birth),
          has_financial_aid,
        }}
        onToggleEdit={() => {
          if (editMode) {
            dispatch({ type: "fillUser", payload: selectedUser });
          } else {
            handleFieldChange("editMode", true);
          }
        }}
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
                handleFieldChange("cpf", val.replace(/\D/g, ""))
              }
            />
            <EditableField
              label="Telefone"
              name="phone"
              type="text"
              value={formatPhone(phone)}
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
              onChange={(val) =>
                handleFieldChange("cep", val.replace(/\D/g, ""))
              }
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
              label="Recebe auxílio"
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
