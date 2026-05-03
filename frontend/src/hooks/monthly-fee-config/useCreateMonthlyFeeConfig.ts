import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { MonthlyFeeConfig, MonthlyFeeConfigRequestDTO } from "../../types";

export const fetchCreateMonthlyFeeConfig = async (
  monthlyFeeConfig: MonthlyFeeConfigRequestDTO,
): Promise<MonthlyFeeConfig> => {
  const res = await api.post<MonthlyFeeConfig>(
    "/v1/monthly-fee-config/",
    monthlyFeeConfig,
  );

  if (res.code !== "SUCCESS") {
    throw new Error(
      res.message || "Erro ao criar configuração da taxa de pagamento",
    );
  }

  return res.data;
};

export const useCreateMonthlyFeeConfig = () => {
  const { mutateAsync: createMonthlyFeeConfig } = useMutation({
    mutationFn: (monthlyFeeConfig: MonthlyFeeConfigRequestDTO) =>
      fetchCreateMonthlyFeeConfig(monthlyFeeConfig),
    retry: false,
  });

  return { createMonthlyFeeConfig };
};
