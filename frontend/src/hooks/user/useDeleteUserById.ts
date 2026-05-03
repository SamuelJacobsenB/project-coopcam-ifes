import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";

export const fetchDeleteUserById = async (id: string): Promise<void> => {
  const res = await api.delete(`/v1/user/${id}/`);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao deletar usuário");
  }
};

export const useDeleteUserById = () => {
  const { mutateAsync: deleteUserById } = useMutation({
    mutationFn: (id: string) => fetchDeleteUserById(id),
    retry: false,
  });

  return { deleteUserById };
};
