import { useQuery } from "@tanstack/react-query";

import { api } from "../../services";
import type { BusReservation } from "../../types";

export const fetchManyBusReservationsByDate = async (
  date: string,
): Promise<BusReservation[]> => {
  const res = await api.get<BusReservation[]>(
    `/v1/bus-reservation/date/${date}/`,
  );

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao buscar reservas");
  }

  return res.data;
};

export const useManyBusReservationsByDate = (date?: string) => {
  const {
    data: reservations,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["busreservations", date],
    queryFn: () => fetchManyBusReservationsByDate(date || ""),
    enabled: !!date,
    retry: false,
  });

  return { reservations: reservations ?? [], isLoading, error, refetch };
};
