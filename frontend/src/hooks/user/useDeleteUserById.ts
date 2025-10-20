import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";

export const fetchDeleteUserById = async (id: string) => {
  try {
    const res = await api.delete(`/v1/user/${id}/`);

    if (res.status !== 204) throw new Error("Erro ao deletar usuário");

    return res.data;
  } catch {
    throw new Error("Erro ao deletar usuário");
  }
};

export const useDeleteUserById = () => {
  const { mutateAsync: deleteUserById } = useMutation({
    mutationFn: async (id: string) => fetchDeleteUserById(id),
  });

  return { deleteUserById };
};
