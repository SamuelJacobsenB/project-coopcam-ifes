import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";

export const fetchDeleteUnavailableDay = async (id: string) => {
  const res = await api.delete(`/v1/unavailable-day/${id}/`);

  if (res.status !== 204) throw new Error("Erro ao deletar dia indisponível");

  return res.data || [];
};

export const useDeleteUnavailableDay = () => {
  const { mutateAsync: deleteUnavailableDay } = useMutation({
    mutationFn: (id: string) => fetchDeleteUnavailableDay(id),
  });

  return { deleteUnavailableDay };
};
