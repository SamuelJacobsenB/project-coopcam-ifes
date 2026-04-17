import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { MonthlyPayment } from "../../types";

export const fetchMonthlyPaymentByUserId = async (user_id: string) => {
  try {
    const res = await api.get<MonthlyPayment[]>(
      `/v1/monthly-payment/user/${user_id}/`,
    );

    if (res.status !== 200) throw new Error("Erro ao buscar pagamentos");

    return res.data;
  } catch {
    throw new Error("Erro ao buscar pagamentos");
  }
};

export const useManyMonthlyPaymentByUserId = () => {
  const { mutateAsync: getMonthlyPaymentByUserId, isPending } = useMutation({
    mutationFn: async (user_id: string) => fetchMonthlyPaymentByUserId(user_id),
  });

  return { getMonthlyPaymentByUserId, isPending };
};
