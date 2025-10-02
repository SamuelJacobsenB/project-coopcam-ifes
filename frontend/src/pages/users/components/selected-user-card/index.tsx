import { useEffect, useReducer } from "react";

import { Card, I, Input } from "../../../../components";
import type { User } from "../../../../types";

import styles from "./styles.module.css";

interface SelectedUserCardProps {
  selectedUser: User;
}

interface State {
  editMode: boolean;
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  adress: string;
  cep: string;
  birth: string;
  error: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducer = (state: State, action: any) => {
  switch (action.type) {
    case "field":
      return {
        ...state,
        [action.payload.field as string]: action.payload.value,
      };
    case "fillUser":
      return {
        ...action.payload,
        error: "",
      };
    default:
      return state;
  }
};
const initialState: State = {
  editMode: false,
  name: "",
  email: "",
  password: "",
  cpf: "",
  phone: "",
  adress: "",
  cep: "",
  birth: "",
  error: "",
};

export function SelectedUserCard({ selectedUser }: SelectedUserCardProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    editMode,
    name,
    email,
    password,
    cpf,
    phone,
    adress,
    cep,
    birth,
    error,
  } = state;

  useEffect(() => {
    if (selectedUser) {
      dispatch({ type: "fillUser", payload: selectedUser });
    }
  }, [selectedUser]);

  function handleDelete() {
    if (error) return;
    const confirmDelete = window.confirm(
      "Tem certeza que deseja deletar este usuário?"
    );
    if (confirmDelete) {
      // Aqui você pode chamar sua função de exclusão, por exemplo:
      console.log("Usuário deletado:", selectedUser.id);
      // deleteUser(selectedUser.id);
    }
  }

  return (
    <Card className={styles.selectedUserBox}>
      <div className={styles.buttons}>
        {editMode && (
          <>
            <button className="btn-sm btn-success" onClick={() => {}}>
              Concluir
            </button>
          </>
        )}
        <button
          className="btn-sm btn-info"
          onClick={() => {
            dispatch({
              type: "field",
              payload: { field: "editMode", value: !editMode },
            });
          }}
        >
          {editMode ? "Cancelar" : "Editar"}
        </button>
        <button className="btn-sm btn-danger" onClick={handleDelete}>
          Deletar
        </button>
      </div>
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
            onChange={(e) =>
              dispatch({
                type: "field",
                payload: { field: "name", value: e.target.value },
              })
            }
          />
        ) : (
          <h1>{selectedUser.name}</h1>
        )}
        <hr />
        <div className={styles.userDetails}>
          <section>
            {editMode ? (
              <>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Digite o email"
                  required
                  value={email}
                  onChange={(e) =>
                    dispatch({
                      type: "field",
                      payload: { field: "email", value: e.target.value },
                    })
                  }
                />
                <Input
                  label="CPF"
                  name="cpf"
                  type="text"
                  placeholder="Digite o CPF"
                  required
                  value={cpf}
                  onChange={(e) =>
                    dispatch({
                      type: "field",
                      payload: { field: "cpf", value: e.target.value },
                    })
                  }
                />
                <Input
                  label="Telefone"
                  name="phone"
                  type="text"
                  placeholder="Digite o telefone"
                  required
                  value={phone}
                  onChange={(e) =>
                    dispatch({
                      type: "field",
                      payload: { field: "phone", value: e.target.value },
                    })
                  }
                />
              </>
            ) : (
              <>
                <p>Email: {selectedUser.email}</p>
                <p>CPF: {selectedUser.cpf}</p>
                <p>Telefone: {selectedUser.phone}</p>
              </>
            )}
          </section>
          <section>
            {editMode ? (
              <>
                <Input
                  label="Endereço"
                  name="adress"
                  type="text"
                  placeholder="Digite o endereço"
                  required
                  value={adress}
                  onChange={(e) =>
                    dispatch({
                      type: "field",
                      payload: { field: "adress", value: e.target.value },
                    })
                  }
                />
                <Input
                  label="CEP"
                  name="cep"
                  type="text"
                  placeholder="Digite o CEP"
                  required
                  value={cep}
                  onChange={(e) =>
                    dispatch({
                      type: "field",
                      payload: { field: "cep", value: e.target.value },
                    })
                  }
                />
                <Input
                  label="Data de nascimento"
                  name="birth"
                  type="date"
                  placeholder="Digite a data de nascimento"
                  required
                  value={birth.split("/").reverse().join("-")}
                  onChange={(e) =>
                    dispatch({
                      type: "field",
                      payload: { field: "birth", value: e.target.value },
                    })
                  }
                />
              </>
            ) : (
              <>
                <p>Endereço: {selectedUser.adress}</p>
                <p>CEP: {selectedUser.cep}</p>
                <p>
                  Data de nascimento: {selectedUser.birth as unknown as string}
                </p>
              </>
            )}
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
            onChange={(e) =>
              dispatch({
                type: "field",
                payload: { field: "password", value: e.target.value },
              })
            }
          />
        )}
      </div>
    </Card>
  );
}
