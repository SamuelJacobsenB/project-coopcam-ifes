import { useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Checkbox,
  Error,
  FormPage,
  I,
  Input,
  PageHeader,
  Private,
} from "../../../components";
import { useMessage } from "../../../contexts";
import { useCreateUser } from "../../../hooks";
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
  const [error, setError] = useState("");

  async function handleCreateUser(e: FormEvent) {
    e.preventDefault();

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
      setError(validationError);
      return;
    }

    try {
      await createUser(userData);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showMessage("Usuário criado com sucesso!", "success");
      navigate("/usuarios");
    } catch {
      showMessage("Erro ao criar usuário", "error");
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

        <hr />

        <form onSubmit={handleCreateUser} className={styles.form}>
          <Error error={error} onClose={() => setError("")} />

          <div className={styles.inputGrid}>
            <Input
              label="Nome Completo"
              placeholder="Nome completo do usuário"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="teste@exemplo.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="CPF"
              placeholder="000.000.000-00"
              required
              value={formatCPF(cpf)}
              onChange={(e) => setCpf(e.target.value)}
            />

            <Input
              label="Número de Telefone"
              placeholder="(00) 00000-0000"
              required
              value={formatPhone(phone)}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              label="Data de Nascimento"
              type="date"
              required
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
            />

            <Input
              label="Endereço"
              placeholder="Rua, Número, Bairro..."
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <Input
              label="CEP"
              placeholder="00000-000"
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
          </div>

          <button type="submit" className="btn btn-secondary">
            Criar usuário
          </button>
        </form>
      </FormPage>
    </Private>
  );
}
