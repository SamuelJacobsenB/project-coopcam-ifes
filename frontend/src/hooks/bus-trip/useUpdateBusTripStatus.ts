import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { BusTrip, Status } from "../../types";

interface UpdateBusTripStatusParams {
  id: string;
  status: Status;
}

export const fetchUpdateBusTripStatus = async (
  id: string,
  status: Status,
): Promise<BusTrip> => {
  const res = await api.put<BusTrip>(`/v1/bus-trip/${id}/status/${status}/`);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao atualizar viagem");
  }

  return res.data;
};

export const useUpdateBusTripStatus = () => {
  const { mutateAsync: updateBusTripStatus } = useMutation({
    mutationFn: ({ id, status }: UpdateBusTripStatusParams) =>
      fetchUpdateBusTripStatus(id, status),
    retry: false,
  });

  return { updateBusTripStatus };
};
