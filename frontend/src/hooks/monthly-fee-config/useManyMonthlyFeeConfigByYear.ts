import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { MonthlyFeeConfig } from "../../types";

export const fetchMonthlyFeeConfigByYear = async (year: number) => {
  try {
    const res = await api.get<MonthlyFeeConfig[]>(
      `/v1/monthly-fee-config/year/${year}/`,
    );

    if (res.status !== 200)
      throw new Error("Erro ao buscar configurações de taxa de pagamento");

    return res.data;
  } catch {
    throw new Error("Erro ao buscar configurações de taxa de pagamento");
  }
};

export const useManyMonthlyFeeConfigByYear = () => {
  const { mutateAsync: getMonthlyFeeConfigByYear } = useMutation({
    mutationFn: async (year: number) => fetchMonthlyFeeConfigByYear(year),
  });

  return { getMonthlyFeeConfigByYear };
};
