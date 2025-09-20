import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { BusTrip } from "../../types";

export const fetchManyBusTripsByDate = async (date: string) => {
  const res = await api.get<BusTrip[]>(`/v1/bus-trip/date/${date}`);

  if (res.status !== 200) throw new Error("Erro ao buscar viagens");

  return res.data;
};

export const useManyBusTripsByDate = () => {
  const { mutateAsync: getManyBusTripsByDate } = useMutation({
    mutationFn: (date: string) => fetchManyBusTripsByDate(date),
  });

  return { getManyBusTripsByDate };
};
