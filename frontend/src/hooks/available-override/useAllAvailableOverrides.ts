import { useQuery } from "@tanstack/react-query";

import { api } from "../../services";
import type { AvailableOverride } from "../../types";

export const fetchAllAvailableOverrides = async (): Promise<
  AvailableOverride[]
> => {
  const res = await api.get<AvailableOverride[]>("/v1/available-override/");

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao buscar dias disponíveis");
  }

  return res.data;
};

export const useAllAvailableOverrides = () => {
  const {
    data: availableOverrides,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["available-overrides"],
    queryFn: fetchAllAvailableOverrides,
    retry: false,
  });

  return { availableOverrides, isLoading, error, refetch };
};
