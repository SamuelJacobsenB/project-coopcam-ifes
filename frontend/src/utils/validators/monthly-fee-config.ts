import type { MonthlyFeeConfigRequestDTO } from "../../types";

export function validateMonthlyFeeConfigRequestDTO(
  monthlyFeeConfig: MonthlyFeeConfigRequestDTO,
): string {
  if (!monthlyFeeConfig.year || monthlyFeeConfig.year.toString().includes("."))
    return "Ano inválido";

  if (
    !monthlyFeeConfig.month ||
    monthlyFeeConfig.month.toString().includes(".") ||
    monthlyFeeConfig.month < 1 ||
    monthlyFeeConfig.month > 12
  )
    return "Mês inválido";

  if (
    !monthlyFeeConfig.base_amount ||
    monthlyFeeConfig.base_amount.toString().includes(".")
  )
    return "Valor padrão inválido";

  if (
    !monthlyFeeConfig.financial_aid_amount ||
    monthlyFeeConfig.financial_aid_amount.toString().includes(".")
  )
    return "Valor com auxílio inválido";

  if (!monthlyFeeConfig.due_date) return "Data de vencimento inválida";

  return "";
}
