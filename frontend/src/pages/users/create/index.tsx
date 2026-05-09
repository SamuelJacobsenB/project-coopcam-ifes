import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";

import {
  Checkbox,
  Error,
  FormPage,
  I,
  Input,
  Loader,
  PageHeader,
  Private,
} from "../../../components";
import { useMessage } from "../../../contexts";
import { useCreateUser } from "../../../hooks";
import { getErrorMessage } from "../../../services";
import type { UserRequestDTO } from "../../../types";
import {
  formatCEP,
  formatCPF,
  formatPhone,
  validateUserRequestDTO,
} from "../../../utils";

import styles from "./styles.module.css";

export function CreateUserPage() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { showMessage } = useMessage();
  const { createUser } = useCreateUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cep, setCep] = useState("");
  const [birth, setBirth] = useState("");
  const [hasFinancialAid, setHasFinancialAid] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateUser(e: FormEvent) {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    const [year, month, day] = birth.split("-");
    const birthDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      12,
    );

    const userData: UserRequestDTO = {
      name,
      email,
      password,
      cpf,
      phone,
      address,
      cep,
      birth: birthDate,
      has_financial_aid: hasFinancialAid,
    };

    const validationError = validateUserRequestDTO(userData);
    if (validationError) {
      setIsLoading(false);
      setError(validationError);
      return;
    }

    try {
      await createUser(userData);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showMessage("Usuário criado com sucesso!", "success");
      navigate("/usuarios");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Private>
      <FormPage className={styles.formContainer}>
        <header className={styles.header}>
          <Link className={styles.backButton} to="/usuarios" title="Voltar">
            <I.arrow_back size={24} />
          </Link>
          <PageHeader
            title="Criar Usuário"
            description="Preencha os campos e envie"
            size={2}
          />
        </header>

        <form onSubmit={handleCreateUser} className={styles.form} noValidate>
          <Error error={error} onClose={() => setError("")} />

          <fieldset disabled={isLoading} className={styles.inputGrid}>
            <Input
              label="Nome Completo"
              placeholder="Nome completo do usuário"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="teste@exemplo.com"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="CPF"
              placeholder="00000000000"
              name="cpf"
              required
              value={formatCPF(cpf)}
              onChange={(e) => setCpf(e.target.value)}
            />

            <Input
              label="Número de Telefone"
              placeholder="00000000000"
              name="phone"
              required
              value={formatPhone(phone)}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              label="Data de Nascimento"
              type="date"
              name="birth"
              required
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
            />

            <Input
              label="Endereço"
              placeholder="Rua, Número, Bairro..."
              name="address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <Input
              label="CEP"
              placeholder="00000000"
              name="cep"
              required
              value={formatCEP(cep)}
              onChange={(e) => setCep(e.target.value)}
            />

            <div className={styles.checkboxWrapper}>
              <Checkbox
                label="Possui auxílio financeiro"
                checked={hasFinancialAid}
                onChange={(e) => setHasFinancialAid(e.target.checked)}
              />
            </div>
          </fieldset>

          <button type="submit" className="btn btn-secondary">
            {isLoading ? <Loader color="white" /> : "Criar usuário"}
          </button>
        </form>
      </FormPage>
    </Private>
  );
}
