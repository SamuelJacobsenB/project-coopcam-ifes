import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { User } from "../../types";

export const fetchUserById = async (id: string): Promise<User> => {
  const res = await api.get<User>(`/v1/user/${id}/`);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao buscar usuário");
  }

  return res.data;
};

export const useUserById = () => {
  const { mutateAsync: getUserById } = useMutation({
    mutationFn: (id: string) => fetchUserById(id),
    retry: false,
  });

  return { getUserById };
};
