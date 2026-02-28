import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { MonthlyFeeConfig, MonthlyFeeConfigRequestDTO } from "../../types";

export const fetchCreateMonthlyFeeConfig = async (
  monthlyFeeConfig: MonthlyFeeConfigRequestDTO,
) => {
  try {
    const res = await api.post<MonthlyFeeConfig>(
      "/v1/monthly-fee-config/",
      monthlyFeeConfig,
    );

    if (res.status != 201)
      throw new Error("Erro ao criar configuração da taxa de pagamento");

    return res.data;
  } catch {
    throw new Error("Erro ao criar configuração da taxa de pagamento");
  }
};

export const useCreateMonthlyFeeConfig = () => {
  const { mutateAsync: createMonthlyFeeConfig } = useMutation({
    mutationFn: (monthlyFeeConfig: MonthlyFeeConfigRequestDTO) =>
      fetchCreateMonthlyFeeConfig(monthlyFeeConfig),
  });

  return { createMonthlyFeeConfig };
};
