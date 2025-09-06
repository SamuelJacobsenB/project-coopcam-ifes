import React, { useState } from "react";

import { FormPage, Input, Error } from "../../components";
import { validateLoginDTO } from "../../utils";
import type { LoginDTO } from "../../types";

import styles from "./styles.module.css";

export function LoginPage() {
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
    console.log(error);
    if (error) {
      setError(error);
      return;
    }

    setError("");
  }

  return (
    <FormPage>
      <section className={styles.header}>
        <h1>Login</h1>
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
        <button className="btn btn-secondary">Enviar</button>
      </form>
    </FormPage>
  );
}
