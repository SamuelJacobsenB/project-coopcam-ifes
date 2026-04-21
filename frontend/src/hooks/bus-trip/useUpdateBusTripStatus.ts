import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { BusTrip, Status } from "../../types";

export const fetchUpdateBusTripStatus = async (
  id: string,
  status: Status
) => {
  const res = await api.put<BusTrip>(`/v1/bus-trip/${id}/status/${status}/`);

  if (res.status !== 200) throw new Error("Erro ao atualizar viagem");

  return res.data;
};

export const useUpdateBusTripStatus = () => {
  const { mutateAsync: updateBusTripStatus } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) =>
      fetchUpdateBusTripStatus(id, status),
  });

  return { updateBusTripStatus };
};
