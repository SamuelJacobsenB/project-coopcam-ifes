import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMessage, useUser } from "../../contexts";
import { useLogin } from "../../hooks";
import { FormPage, Input, Error } from "../../components";
import { validateLoginDTO } from "../../utils";
import type { LoginDTO } from "../../types";

import styles from "./styles.module.css";

export function LoginPage() {
  const navigate = useNavigate();

  const { findUser } = useUser();
  const { showMessage } = useMessage();
  const { login } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const loginDTO: LoginDTO = {
      email,
      password,
    };

    const error = validateLoginDTO(loginDTO);
    if (error) {
      setError(error);
      return;
    }

    setError("");

    try {
      await login(loginDTO);

      await findUser();
      showMessage("Login realizado com sucesso", "success");
      navigate("/");
    } catch {
      setError("Email ou senha incorretos");
    }
  }

  return (
    <FormPage>
      <section className={styles.header}>
        <h1 className={styles.title}>Login</h1>
        <hr />
      </section>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Error error={error} onClose={() => setError("")} />
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Digite seu email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Senha"
          name="password"
          type="password"
          placeholder="Digite sua senha"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary">
          Enviar
        </button>
      </form>
    </FormPage>
  );
}
