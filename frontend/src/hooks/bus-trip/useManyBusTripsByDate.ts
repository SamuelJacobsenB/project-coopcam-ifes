import { useQuery } from "@tanstack/react-query";

import { api } from "../../services";
import type { BusTrip } from "../../types";

export const fetchManyBusTripsByDate = async (
  date: string,
): Promise<BusTrip[]> => {
  const res = await api.get<BusTrip[]>(`/v1/bus-trip/date/${date}/`);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao buscar viagens");
  }

  return res.data;
};

export const useManyBusTripsByDate = (date?: string) => {
  const {
    data: trips,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bustrips", date],
    queryFn: () => fetchManyBusTripsByDate(date || ""),
    enabled: !!date,
    retry: false,
  });

  return { trips: trips ?? [], isLoading, error, refetch };
};
