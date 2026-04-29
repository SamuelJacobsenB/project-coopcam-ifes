import { useQueryClient } from "@tanstack/react-query";
import { useReducer, type ChangeEvent, type FormEvent } from "react";
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
import { formatCEP, formatCPF, validateUserRequestDTO } from "../../../utils";
import styles from "./styles.module.css";

type Action = { type: "field"; payload: { field: string; value: unknown } };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducer = (state: any, action: Action) => {
  if (action.type === "field") {
    return { ...state, [action.payload.field]: action.payload.value };
  }
  return state;
};

const initialState = {
  name: "",
  email: "",
  password: "",
  cpf: "",
  phone: "",
  address: "",
  cep: "",
  birth: "",
  has_financial_aid: false,
  error: "",
};

export function CreateUserPage() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { createUser } = useCreateUser();
  const { showMessage } = useMessage();
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange =
    (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      dispatch({ type: "field", payload: { field, value } });
    };

  async function handleCreateUser(e: FormEvent) {
    e.preventDefault();

    const [year, month, day] = state.birth.split("-");
    const birth = new Date(Number(year), Number(month) - 1, Number(day), 12);

    const userData = {
      name: state.name,
      email: state.email,
      password: state.password,
      cpf: state.cpf,
      phone: state.phone,
      address: state.address,
      cep: state.cep,
      birth,
      has_financial_aid: state.has_financial_aid,
    } as UserRequestDTO;

    const validationError = validateUserRequestDTO(userData);
    if (validationError) {
      dispatch({
        type: "field",
        payload: { field: "error", value: validationError },
      });
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
          <Error
            error={state.error}
            onClose={() =>
              dispatch({
                type: "field",
                payload: { field: "error", value: "" },
              })
            }
          />

          <div className={styles.inputGrid}>
            <Input
              label="Nome Completo"
              placeholder="Nome completo do usuário"
              required
              value={state.name}
              onChange={handleChange("name")}
            />

            <Input
              label="E-mail"
              type="email"
              placeholder="teste@exemplo.com"
              required
              value={state.email}
              onChange={handleChange("email")}
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              required
              value={state.password}
              onChange={handleChange("password")}
            />

            <Input
              label="CPF"
              placeholder="00000000000"
              required
              value={formatCPF(state.cpf)}
              onChange={handleChange("cpf")}
            />

            <Input
              label="Número de Telefone"
              placeholder="(00) 00000-0000"
              required
              value={state.phone}
              onChange={handleChange("phone")}
            />

            <Input
              label="Data de Nascimento"
              type="date"
              required
              value={state.birth}
              onChange={handleChange("birth")}
            />

            <Input
              label="Endereço"
              placeholder="Rua, Número, Bairro..."
              required
              value={state.address}
              onChange={handleChange("address")}
            />

            <Input
              label="CEP"
              placeholder="00000000"
              required
              value={formatCEP(state.cep)}
              onChange={handleChange("cep")}
            />

            <div className={styles.checkboxWrapper}>
              <Checkbox
                label="Possui auxílio financeiro"
                checked={state.has_financial_aid}
                onChange={handleChange("has_financial_aid")}
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
