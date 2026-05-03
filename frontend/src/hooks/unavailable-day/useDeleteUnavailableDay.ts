import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";

export const fetchDeleteUnavailableDay = async (id: string): Promise<void> => {
  const res = await api.delete(`/v1/unavailable-day/${id}/`);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao deletar dia indisponível");
  }
};

export const useDeleteUnavailableDay = () => {
  const { mutateAsync: deleteUnavailableDay } = useMutation({
    mutationFn: (id: string) => fetchDeleteUnavailableDay(id),
    retry: false,
  });

  return { deleteUnavailableDay };
};
