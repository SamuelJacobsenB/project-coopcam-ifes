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
import { validateUserRequestDTO } from "../../../utils";
import styles from "./styles.module.css";

// Tipagem rigorosa para as ações do reducer
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
  const { createUser } = useCreateUser();
  const { showMessage } = useMessage();
  const [state, dispatch] = useReducer(reducer, initialState);

  // Função auxiliar para simplificar a atualização de campos
  const handleChange =
    (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      dispatch({ type: "field", payload: { field, value } });
    };

  async function handleCreateUser(e: FormEvent) {
    e.preventDefault();
    const { ...userData } = state;

    const validationError = validateUserRequestDTO(userData as UserRequestDTO);
    if (validationError) {
      dispatch({
        type: "field",
        payload: { field: "error", value: validationError },
      });
      return;
    }

    try {
      await createUser(userData as UserRequestDTO);
      showMessage("Utilizador criado com sucesso!", "success");
      navigate("/usuarios");
    } catch {
      showMessage("Erro ao criar utilizador", "error");
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
              value={state.cpf}
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
              value={state.cep}
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
