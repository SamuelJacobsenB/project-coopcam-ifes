import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { MonthlyPayment } from "../../types";

interface ManyByPeriodParams {
  month: number;
  year: number;
}

export const fetchManyByPeriod = async ({
  year,
  month,
}: ManyByPeriodParams): Promise<MonthlyPayment[]> => {
  const res = await api.get<MonthlyPayment[]>(
    `/v1/monthly-payment/year/${year}/month/${month}/`,
  );

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao buscar pagamentos");
  }

  return res.data;
};

export const useManyByPeriod = () => {
  const { mutateAsync: getManyByPeriod } = useMutation({
    mutationFn: (params: ManyByPeriodParams) => fetchManyByPeriod(params),
    retry: false,
  });

  return { getManyByPeriod };
};
