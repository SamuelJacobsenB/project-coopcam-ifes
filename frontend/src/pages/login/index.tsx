import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Error, FormPage, Input, Loader, PageHeader } from "../../components";
import { useMessage, useUser } from "../../contexts";
import { useLogin } from "../../hooks";
import type { LoginDTO } from "../../types";
import { validateLoginDTO } from "../../utils";

import styles from "./styles.module.css";

export function LoginPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { showMessage } = useMessage();
  const { login } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      const loginDTO: LoginDTO = { email, password };

      const validationError = validateLoginDTO(loginDTO);
      if (validationError) {
        setError(validationError);
        setIsLoading(false);
        return;
      }

      try {
        await login(loginDTO);
        showMessage("Login realizado com sucesso", "success");
        navigate("/");
      } catch {
        setError("Email ou senha incorretos");
      } finally {
        setIsLoading(false);
      }
    },
    [email, password, login, showMessage, navigate],
  );

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <FormPage>
      <PageHeader title="Login" description="Faça seu login" size={3} />

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <Error error={error} onClose={() => setError("")} />

        <fieldset disabled={isLoading}>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Digite seu email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            placeholder="Digite sua senha"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </fieldset>

        <button
          type="submit"
          className="btn btn-secondary"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? <Loader color="white" /> : "Enviar"}
        </button>
      </form>
    </FormPage>
  );
}
