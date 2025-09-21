import { useQuery } from "@tanstack/react-query";

import { api } from "../../services";
import type { User } from "../../types";

export const fetchManyUsers = async (page: number, name: string) => {
  try {
    const res = await api.get<User[]>(
      `/v1/user/?page=${page}${name && `&name=${name}`}`
    );

    if (res.status !== 200) throw new Error("Erro ao buscar usuários");

    return res.data;
  } catch {
    throw new Error("Erro ao buscar usuários");
  }
};

export const useManyUsers = (page: number, name: string) => {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", page, name],
    queryFn: () => fetchManyUsers(page || 1, name || ""),
  });

  return { users, isLoading, error };
};
