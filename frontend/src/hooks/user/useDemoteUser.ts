import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { User } from "../../types";

export const fetchDemoteUser = async (userId: string): Promise<User> => {
  const res = await api.post<User>(`/v1/user/demote/${userId}/`);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao rebaixar usuário");
  }

  return res.data;
};

export const useDemoteUser = () => {
  const { mutateAsync: demoteUser } = useMutation({
    mutationFn: (userId: string) => fetchDemoteUser(userId),
    retry: false,
  });

  return { demoteUser };
};
