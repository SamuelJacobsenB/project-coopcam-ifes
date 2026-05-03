import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { MonthlyFeeConfig } from "../../types";

export const fetchMonthlyFeeConfigByYear = async (
  year: number,
): Promise<MonthlyFeeConfig[]> => {
  const res = await api.get<MonthlyFeeConfig[]>(
    `/v1/monthly-fee-config/year/${year}/`,
  );

  if (res.code !== "SUCCESS") {
    throw new Error(
      res.message || "Erro ao buscar configurações de taxa de pagamento",
    );
  }

  return res.data;
};

export const useManyMonthlyFeeConfigByYear = () => {
  const { mutateAsync: getMonthlyFeeConfigByYear } = useMutation({
    mutationFn: (year: number) => fetchMonthlyFeeConfigByYear(year),
    retry: false,
  });

  return { getMonthlyFeeConfigByYear };
};
