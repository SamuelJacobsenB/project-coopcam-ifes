import { useQuery } from "@tanstack/react-query";

import { api } from "../../services";
import type { User } from "../../types";

export const fetchManyUsers = async (name: string) => {
  try {
    const res = await api.get<User[]>(
      `/v1/user/?${name && `name=${name}`}`
    );

    if (res.status !== 200) throw new Error("Erro ao buscar usuários");

    return res.data;
  } catch {
    throw new Error("Erro ao buscar usuários");
  }
};

export const useManyUsers = (name: string) => {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", name],
    queryFn: () => fetchManyUsers(name || ""),
  });

  return { users, isLoading, error };
};
