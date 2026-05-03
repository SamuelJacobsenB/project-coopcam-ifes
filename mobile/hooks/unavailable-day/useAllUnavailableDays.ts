import { useQuery } from "@tanstack/react-query";

import { api } from "@/services";
import type { UnavailableDay } from "@/types";

export const fetchAllUnavailableDays = async () => {
  const res = await api.get<UnavailableDay[]>(`/v1/unavailable-day/`);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao buscar dias indisponíveis");
  }

  return res.data;
};

export const useAllUnavailableDays = () => {
  const {
    data: unavailableDays,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["unavailable-days"],
    queryFn: fetchAllUnavailableDays,
  });

  return { unavailableDays, isLoading, error, refetch };
};
