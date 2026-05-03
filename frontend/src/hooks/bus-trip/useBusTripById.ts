import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { BusTrip } from "../../types";

export const fetchBusTripById = async (id: string): Promise<BusTrip> => {
  const res = await api.get<BusTrip>(`/v1/bus-trip/${id}/`);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao buscar viagem");
  }

  return res.data;
};

export const useBusTripById = () => {
  const { mutateAsync: getBusTripById } = useMutation({
    mutationFn: (id: string) => fetchBusTripById(id),
    retry: false,
  });

  return { getBusTripById };
};
