import { useReducer, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Error,
  FormPage,
  I,
  Input,
  PageHeader,
  Private,
  Select,
} from "../../../components";
import { useMessage } from "../../../contexts";
import { useCreateMonthlyFeeConfig } from "../../../hooks";
import type { MonthlyFeeConfigRequestDTO } from "../../../types";
import { months, validateMonthlyFeeConfigRequestDTO } from "../../../utils";

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
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  base_amount: 0,
  financial_aid_amount: 0,
  due_date: new Date(new Date().setMonth(new Date().getMonth() + 1))
    .toISOString()
    .split("T")[0], // Simplificado para string no estado
  error: "",
};

export function CreatePaymentFeeConfigPage() {
  const navigate = useNavigate();
  const { createMonthlyFeeConfig } = useCreateMonthlyFeeConfig();
  const { showMessage } = useMessage();

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange =
    (field: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      dispatch({ type: "field", payload: { field, value: e.target.value } });
    };

  async function handleCreateMonthlyFeeConfig(e: FormEvent) {
    e.preventDefault();

    const monthlyFeeConfig: MonthlyFeeConfigRequestDTO = {
      month: Number(state.month),
      year: Number(state.year),
      base_amount: Number(state.base_amount) * 100,
      financial_aid_amount: Number(state.financial_aid_amount) * 100,
      due_date: new Date(state.due_date),
    };

    const validationError =
      validateMonthlyFeeConfigRequestDTO(monthlyFeeConfig);
    if (validationError) {
      dispatch({
        type: "field",
        payload: { field: "error", value: validationError },
      });
      return;
    }

    try {
      await createMonthlyFeeConfig(monthlyFeeConfig);
      showMessage("Configuração de taxa criada com sucesso!", "success");
      navigate("/pagamentos");
    } catch {
      showMessage("Erro ao criar configuração de taxa", "error");
    }
  }

  return (
    <Private>
      <FormPage className={styles.formContainer}>
        <header className={styles.header}>
          <Link className={styles.backButton} to="/pagamentos" title="Voltar">
            <I.arrow_back size={24} />
          </Link>
          <PageHeader
            title="Configurar Taxa Mensal"
            description="Defina os valores e datas de vencimento para o período"
            size={2}
          />
        </header>

        <hr />

        <form onSubmit={handleCreateMonthlyFeeConfig} className={styles.form}>
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
            <Select
              label="Mês de Referência"
              name="month"
              value={state.month}
              options={months.map((m, i) => ({ value: i + 1, label: m }))}
              onChange={handleChange("month")}
            />

            <Input
              label="Ano"
              name="year"
              type="number"
              value={state.year}
              onChange={handleChange("year")}
            />

            <Input
              label="Valor Base (R$)"
              name="base_amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={state.base_amount}
              onChange={handleChange("base_amount")}
            />

            <Input
              label="Valor com Auxílio (R$)"
              name="financial_aid_amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={state.financial_aid_amount}
              onChange={handleChange("financial_aid_amount")}
            />

            <div className={styles.fullWidth}>
              <Input
                label="Data de Vencimento"
                name="due_date"
                type="date"
                value={state.due_date}
                onChange={handleChange("due_date")}
              />
            </div>
          </div>

          <button className="btn btn-secondary" type="submit">
            Salvar Configuração
          </button>
        </form>
      </FormPage>
    </Private>
  );
}
