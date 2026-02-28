import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";

export const fetchDeleteMonthlyFeeConfigById = async (id: string) => {
  try {
    const res = await api.delete(`/v1/monthly-fee-config/${id}/`);

    if (res.status !== 204)
      throw new Error("Erro ao deletar configuração de taxa de pagamento");

    return res.data;
  } catch {
    throw new Error("Erro ao deletar configuração de taxa de pagamento");
  }
};

export const useDeleteMonthlyFeeConfigById = () => {
  const { mutateAsync: deleteMonthlyFeeConfigById } = useMutation({
    mutationFn: async (id: string) => fetchDeleteMonthlyFeeConfigById(id),
  });

  return { deleteMonthlyFeeConfigById };
};
