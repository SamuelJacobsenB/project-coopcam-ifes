import React, { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import { Error, FormPage, Input, PageHeader } from "../../components";
import { useMessage, useUser } from "../../contexts";
import { useLogin } from "../../hooks";
import type { LoginDTO } from "../../types";
import { validateLoginDTO } from "../../utils";

import styles from "./styles.module.css";

interface State {
  email: string;
  password: string;
  error: string;
}

type Action = {
  type: "field";
  payload: { field: keyof State; value: string };
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "field":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
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

  const { user } = useUser();
  const { showMessage } = useMessage();
  const { login } = useLogin();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { email, password, error } = state;

  function setError(value: string) {
    dispatch({ type: "field", payload: { field: "error", value } });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const loginDTO: LoginDTO = { email, password };

    const validationError = validateLoginDTO(loginDTO);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");

    try {
      await login(loginDTO);
      showMessage("Login realizado com sucesso", "success");
      navigate("/");
    } catch {
      setError("Email ou senha incorretos");
    }
  }

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  return (
    <FormPage>
      <PageHeader title="Login" description="Faça seu login" size={3} />

      <form onSubmit={handleSubmit} className={styles.form}>
        <Error error={error} onClose={() => setError("")} />
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
