import { useQuery } from "@tanstack/react-query";

import { api } from "../../services";
import type { User } from "../../types";

export const fetchManyUsers = async (name: string): Promise<User[]> => {
  const url = name ? `/v1/user/?name=${name}` : "/v1/user/";
  const res = await api.get<User[]>(url);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao buscar usuários");
  }

  return res.data;
};

export const useManyUsers = (name: string) => {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", name],
    queryFn: () => fetchManyUsers(name),
    retry: false,
  });

  return { users, isLoading, error };
};
