import { useQuery } from "@tanstack/react-query";

import { api } from "@/services";
import { APIResponse, User } from "@/types";

export const fetchOwnUser = async () => {
  // ✅ CORREÇÃO: Remover generic redundante. O segundo generic (APIResponse<T>)
  // não é necessário aqui pois axios já retorna a resposta via interceptor
  const res = await api.get<User>("/v1/user/own/");

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Faça seu login");
  }

  return res.data;
};

export const useOwnUser = () => {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchOwnUser,
    retry: false,
  });

  return { user, isLoading, error, refetch };
};
