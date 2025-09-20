import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";

export const fetchDeleteAvailableOverride = async (id: string) => {
  const res = await api.delete(`/v1/available-override/${id}`);

  if (res.status !== 200) throw new Error("Erro ao deletar dia disponível");

  return res.data;
};

export const useDeleteAvailableOverride = () => {
  const { mutateAsync: deleteAvailableOverride } = useMutation({
    mutationFn: (id: string) => fetchDeleteAvailableOverride(id),
  });

  return { deleteAvailableOverride };
};
