import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { MonthlyPayment } from "../../types";

export const fetchMonthlyPaymentByUserId = async (
  userId: string,
): Promise<MonthlyPayment[]> => {
  const res = await api.get<MonthlyPayment[]>(
    `/v1/monthly-payment/user/${userId}/`,
  );

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao buscar pagamentos");
  }

  return res.data;
};

export const useManyMonthlyPaymentByUserId = () => {
  const { mutateAsync: getMonthlyPaymentByUserId, isPending } = useMutation({
    mutationFn: (userId: string) => fetchMonthlyPaymentByUserId(userId),
    retry: false,
  });

  return { getMonthlyPaymentByUserId, isPending };
};
