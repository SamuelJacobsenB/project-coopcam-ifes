import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/contexts";
import { api } from "@/services";
import { MonthlyPayment } from "@/types";

export const fetchManyMonthlyPaymentsByOwnUser = async (user_id: string) => {
  const res = await api.get<MonthlyPayment[]>(
    `/v1/monthly-payment/user/${user_id}/`,
  );

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao buscar pagamentos");
  }

  return res.data;
};

export const useManyMonthlyPaymentsByOwnUser = () => {
  const { user } = useUser();

  const {
    data: monthlyPayments,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["monthly-payments", user?.id],
    queryFn: () => fetchManyMonthlyPaymentsByOwnUser(user!.id),
    enabled: !!user?.id,

    retry: false,
  });

  return { monthlyPayments, isLoading, error, refetch };
};
