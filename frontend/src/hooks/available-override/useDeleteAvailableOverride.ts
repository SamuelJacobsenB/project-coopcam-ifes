import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";

export const fetchDeleteAvailableOverride = async (
  id: string,
): Promise<void> => {
  const res = await api.delete(`/v1/available-override/${id}/`);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao deletar dia disponível");
  }
};

export const useDeleteAvailableOverride = () => {
  const { mutateAsync: deleteAvailableOverride } = useMutation({
    mutationFn: (id: string) => fetchDeleteAvailableOverride(id),
    retry: false,
  });

  return { deleteAvailableOverride };
};
