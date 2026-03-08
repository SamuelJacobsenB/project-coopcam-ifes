import { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Error,
  FormPage,
  I,
  Input,
  Private,
  Select,
} from "../../../components";
import { useMessage } from "../../../contexts";
import { useCreateMonthlyFeeConfig } from "../../../hooks";
import type { MonthlyFeeConfigRequestDTO } from "../../../types";
import { months, validateMonthlyFeeConfigRequestDTO } from "../../../utils";

import styles from "./styles.module.css";

interface State {
  month: number;
  year: number;
  base_amount: number;
  financial_aid_amount: number;
  due_date: Date;
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
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  base_amount: 0,
  financial_aid_amount: 0,
  due_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
  error: "",
};

export function CreatePaymentFeeConfigPage() {
  const navigate = useNavigate();
  const { createMonthlyFeeConfig } = useCreateMonthlyFeeConfig();
  const { showMessage } = useMessage();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { month, year, base_amount, financial_aid_amount, due_date, error } =
    state;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (field: keyof State, value: any) => {
    dispatch({ type: "field", payload: { field, value } });
  };

  async function handleCreateMonthlyFeeConfig(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    const monthlyFeeConfig: MonthlyFeeConfigRequestDTO = {
      month: Number(month),
      year: Number(year),
      base_amount: Number(base_amount) * 100,
      financial_aid_amount: Number(financial_aid_amount) * 100,
      due_date,
    };

    const validationError =
      validateMonthlyFeeConfigRequestDTO(monthlyFeeConfig);
    if (validationError) {
      handleChange("error", validationError);
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
      <FormPage className={styles.formSection}>
        <Link className={styles.back} to="/pagamentos">
          <I.arrow_back />
        </Link>

        <section className={styles.header}>
          <h1 className={styles.title}>Configurar Taxa Mensal</h1>
          <hr />
        </section>

        <form onSubmit={handleCreateMonthlyFeeConfig} className={styles.form}>
          <Error error={error} onClose={() => handleChange("error", "")} />

          <div className={styles.row}>
            <Select
              label="Mês de Referência"
              name="month"
              value={month}
              options={months.map((m, i) => ({ value: i + 1, label: m }))}
              onChange={(e) => handleChange("month", e.target.value)}
            />
            <Input
              label="Ano"
              name="year"
              type="number"
              value={year}
              onChange={(e) => handleChange("year", e.target.value)}
            />
          </div>

          <Input
            label="Valor Base (R$)"
            name="base_amount"
            type="number"
            step="0.1"
            value={base_amount}
            onChange={(e) => handleChange("base_amount", e.target.value)}
          />

          <Input
            label="Valor com Auxílio (R$)"
            name="financial_aid_amount"
            type="number"
            step="0.1"
            value={financial_aid_amount}
            onChange={(e) =>
              handleChange("financial_aid_amount", e.target.value)
            }
          />

          <Input
            label="Data de Vencimento"
            name="due_date"
            type="date"
            // Converte Date para string YYYY-MM-DD para o input HTML
            value={due_date.toISOString().split("T")[0]}
            onChange={(e) => handleChange("due_date", new Date(e.target.value))}
          />

          <button className="btn btn-secondary" type="submit">
            Salvar Configuração
          </button>
        </form>
      </FormPage>
    </Private>
  );
}
