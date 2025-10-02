import { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useMessage } from "../../../contexts";
import { useCreateUser } from "../../../hooks";
import { Error, FormPage, I, Input, Private } from "../../../components";
import { validateUserRequestDTO } from "../../../utils";
import type { UserRequestDTO } from "../../../types";

import styles from "./styles.module.css";

interface State {
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
    default:
      return state;
  }
};
const initialState: State = {
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

export function CreateUserPage() {
  const navigate = useNavigate();

  const { createUser } = useCreateUser();
  const { showMessage } = useMessage();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { name, email, password, cpf, phone, adress, cep, birth, error } =
    state;

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const user: UserRequestDTO = {
      name,
      email,
      password,
      cpf,
      phone,
      adress,
      cep,
      birth,
    };

    const error = validateUserRequestDTO(user);
    if (error) {
      dispatch({ type: "field", payload: { field: "error", value: error } });
      return;
    }

    try {
      await createUser(user);

      showMessage("Usuário criado com sucesso!", "success");
      navigate("/usuarios");
    } catch {
      showMessage("Erro ao criar usuário", "error");
    }
  }

  return (
    <Private>
      <FormPage className={styles.formSection}>
        <Link className={styles.back} to="/usuarios">
          <I.arrow_back />
        </Link>
        <section className={styles.header}>
          <h1 className={styles.title}>Criar Usuário</h1>
          <hr />
        </section>
        <form onSubmit={handleCreateUser} className={styles.form}>
          <Error
            error={error}
            onClose={() =>
              dispatch({
                type: "field",
                payload: { field: "error", value: "" },
              })
            }
          />
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
            label="Senha"
            name="password"
            type="password"
            placeholder="Digite a senha"
            required
            value={password}
            onChange={(e) =>
              dispatch({
                type: "field",
                payload: { field: "password", value: e.target.value },
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
            label="Data de Nascimento"
            name="birth"
            type="date"
            placeholder="Digite a data de nascimento"
            required
            value={birth}
            onChange={(e) =>
              dispatch({
                type: "field",
                payload: { field: "birth", value: e.target.value },
              })
            }
          />
          <button className="btn btn-secondary">Enviar</button>
        </form>
      </FormPage>
    </Private>
  );
}
