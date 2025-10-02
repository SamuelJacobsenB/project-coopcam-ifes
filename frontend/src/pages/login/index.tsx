import React, { useReducer } from "react";
import { useNavigate } from "react-router-dom";

import { useMessage, useUser } from "../../contexts";
import { useLogin } from "../../hooks";
import { FormPage, Input, Error } from "../../components";
import { validateLoginDTO } from "../../utils";
import type { LoginDTO } from "../../types";

import styles from "./styles.module.css";

interface State {
  email: string;
  password: string;
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
  email: "",
  password: "",
  error: "",
};

export function LoginPage() {
  const navigate = useNavigate();

  const { findUser } = useUser();
  const { showMessage } = useMessage();
  const { login } = useLogin();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { email, password, error } = state;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const loginDTO: LoginDTO = {
      email,
      password,
    };

    const error = validateLoginDTO(loginDTO);
    if (error) {
      dispatch({ type: "field", payload: { field: "error", value: error } });
      return;
    }

    dispatch({ type: "field", payload: { field: "error", value: "" } });

    try {
      await login(loginDTO);

      await findUser();
      showMessage("Login realizado com sucesso", "success");
      navigate("/");
    } catch {
      dispatch({
        type: "field",
        payload: { field: "error", value: "Email ou senha incorretos" },
      });
    }
  }

  return (
    <FormPage>
      <section className={styles.header}>
        <h1 className={styles.title}>Login</h1>
        <hr />
      </section>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Error
          error={error}
          onClose={() =>
            dispatch({ type: "field", payload: { field: "error", value: "" } })
          }
        />
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Digite seu email"
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
          placeholder="Digite sua senha"
          required
          value={password}
          onChange={(e) =>
            dispatch({
              type: "field",
              payload: { field: "password", value: e.target.value },
            })
          }
        />
        <button type="submit" className="btn btn-secondary">
          Enviar
        </button>
      </form>
    </FormPage>
  );
}
