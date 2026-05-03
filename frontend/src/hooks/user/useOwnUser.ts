import { useQuery } from "@tanstack/react-query";

import { api } from "../../services";
import type { User } from "../../types";

export const fetchOwnUser = async (): Promise<User> => {
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
