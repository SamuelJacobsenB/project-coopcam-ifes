import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";

interface EmitMonthlyPaymentBatchParams {
  month: number;
  year: number;
}

export const fetchEmitMonthlyPaymentBatch = async (
  params: EmitMonthlyPaymentBatchParams,
): Promise<void> => {
  const res = await api.post("/v1/monthly-payment/emit-batch/", params);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao emitir lote de pagamentos mensais");
  }
};

export const useEmitMonthlyPaymentBatch = () => {
  const { mutateAsync: emitMonthlyPaymentBatch } = useMutation({
    mutationFn: (params: EmitMonthlyPaymentBatchParams) =>
      fetchEmitMonthlyPaymentBatch(params),
    retry: false,
  });

  return { emitMonthlyPaymentBatch };
};
