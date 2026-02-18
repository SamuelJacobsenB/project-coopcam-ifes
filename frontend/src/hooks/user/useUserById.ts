import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";

export const fetchUserById = async (id: string) => {
  try {
    const res = await api.get(`/v1/user/${id}/`);

    if (res.status !== 204) throw new Error("Erro ao buscar usuário");

    return res.data;
  } catch {
    throw new Error("Erro ao buscar usuário");
  }
};

export const useUserById = () => {
  const { mutateAsync: getUserById } = useMutation({
    mutationFn: async (id: string) => fetchUserById(id),
  });

  return { getUserById };
};
