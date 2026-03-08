import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";

interface Data {
  month: number;
  year: number;
}

export const fetchEmitMonthlyPaymentBatch = async (data: Data) => {
  try {
    const res = await api.post("/v1/monthly-payment/emit-batch/", data);

    if (res.status != 200)
      throw new Error("Erro ao emitir configuração da taxa de pagamento");

    return res.data;
  } catch {
    throw new Error("Erro ao emitir configuração da taxa de pagamento");
  }
};

export const useEmitMonthlyPaymentBatch = () => {
  const { mutateAsync: emitMonthlyPaymentBatch } = useMutation({
    mutationFn: (data: Data) => fetchEmitMonthlyPaymentBatch(data),
  });

  return { emitMonthlyPaymentBatch };
};
