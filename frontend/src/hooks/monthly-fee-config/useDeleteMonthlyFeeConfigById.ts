import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";

export const fetchDeleteMonthlyFeeConfigById = async (
  id: string,
): Promise<void> => {
  const res = await api.delete(`/v1/monthly-fee-config/${id}/`);

  if (res.code !== "SUCCESS")
    {throw new Error(res.message||"Erro ao deletar configuração de taxa de pagamento");}
};

export const useDeleteMonthlyFeeConfigById = () => {
  const { mutateAsync: deleteMonthlyFeeConfigById } = useMutation({
    mutationFn: (id: string) => fetchDeleteMonthlyFeeConfigById(id),
    retry: false,
  });

  return { deleteMonthlyFeeConfigById };
};
