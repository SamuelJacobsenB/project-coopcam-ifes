import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { BusTrip, BusTripUpdateDTO } from "../../types";

export const fetchUpdateBusTrip = async (
  id: string,
  busTrip: BusTripUpdateDTO
) => {
  const res = await api.put<BusTrip>(`/v1/bus-trip/${id}/`, busTrip);

  if (res.status !== 200) throw new Error("Erro ao atualizar viagem");

  return res.data;
};

export const useUpdateBusTrip = () => {
  const { mutateAsync: updateBusTrip } = useMutation({
    mutationFn: ({ id, busTrip }: { id: string; busTrip: BusTripUpdateDTO }) =>
      fetchUpdateBusTrip(id, busTrip),
  });

  return { updateBusTrip };
};
