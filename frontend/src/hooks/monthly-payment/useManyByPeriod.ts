import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { MonthlyPayment } from "../../types";

interface Data {
  month: number;
  year: number;
}

export const fetchManyByPeriod = async ({ year, month }: Data) => {
  try {
    const res = await api.get<MonthlyPayment[]>(
      `/v1/monthly-payment/year/${year}/month/${month}/`,
    );

    if (res.status != 200) throw new Error("Erro ao buscar por pagamentos");

    return res.data;
  } catch {
    throw new Error("Erro ao buscar por pagamentos");
  }
};

export const useManyByPeriod = () => {
  const { mutateAsync: getManyByPeriod } = useMutation({
    mutationFn: (data: Data) => fetchManyByPeriod(data),
  });

  return { getManyByPeriod };
};
