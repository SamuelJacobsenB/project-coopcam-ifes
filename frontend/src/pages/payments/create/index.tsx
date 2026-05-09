import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Error,
  FormPage,
  I,
  Input,
  Loader,
  PageHeader,
  Private,
  Select,
} from "../../../components";
import { useMessage } from "../../../contexts";
import { useCreateMonthlyFeeConfig } from "../../../hooks";
import { getErrorMessage } from "../../../services";
import type { MonthlyFeeConfigRequestDTO } from "../../../types";
import { months, validateMonthlyFeeConfigRequestDTO } from "../../../utils";

import styles from "./styles.module.css";

export function CreatePaymentFeeConfigPage() {
  const navigate = useNavigate();

  const { showMessage } = useMessage();
  const { createMonthlyFeeConfig } = useCreateMonthlyFeeConfig();

  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [financialAidAmount, setFinancialAidAmount] = useState<number>(0);
  const [dueDateStr, setDueDateStr] = useState<string>(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toISOString()
      .split("T")[0],
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateMonthlyFeeConfig(e: FormEvent) {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    const [dYear, dMonth, dDay] = dueDateStr.split("-");
    const dueDate = new Date(
      Number(dYear),
      Number(dMonth) - 1,
      Number(dDay),
      12,
    );

    const monthlyFeeConfig: MonthlyFeeConfigRequestDTO = {
      month: Number(month),
      year: Number(year),
      base_amount: Number(baseAmount) * 100, // Converte para centavos
      financial_aid_amount: Number(financialAidAmount) * 100, // Converte para centavos
      due_date: dueDate,
    };

    const validationError =
      validateMonthlyFeeConfigRequestDTO(monthlyFeeConfig);
    if (validationError) {
      setIsLoading(false);
      setError(validationError);
      return;
    }

    try {
      await createMonthlyFeeConfig(monthlyFeeConfig);
      showMessage("Configuração de taxa criada com sucesso!", "success");
      navigate("/pagamentos");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
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

        <form
          onSubmit={handleCreateMonthlyFeeConfig}
          className={styles.form}
          noValidate
        >
          <Error error={error} onClose={() => setError("")} />

          <fieldset disabled={isLoading} className={styles.inputGrid}>
            <Select
              label="Mês de Referência"
              name="month"
              value={month}
              options={months.map((m, i) => ({ value: i + 1, label: m }))}
              onChange={(e) => setMonth(Number(e.target.value))}
            />

            <Input
              label="Ano"
              name="year"
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />

            <Input
              label="Valor Base (R$)"
              name="base_amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={baseAmount}
              onChange={(e) => setBaseAmount(Number(e.target.value))}
            />

            <Input
              label="Valor com Auxílio (R$)"
              name="financial_aid_amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={financialAidAmount}
              onChange={(e) => setFinancialAidAmount(Number(e.target.value))}
            />

            <div className={styles.fullWidth}>
              <Input
                label="Data de Vencimento"
                name="due_date"
                type="date"
                value={dueDateStr}
                onChange={(e) => setDueDateStr(e.target.value)}
              />
            </div>
          </fieldset>

          <button className="btn btn-secondary" type="submit">
            {isLoading ? <Loader color="white" /> : "Criar Configuração"}
          </button>
        </form>
      </FormPage>
    </Private>
  );
}
