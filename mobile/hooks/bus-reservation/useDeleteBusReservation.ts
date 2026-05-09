import { useMutation } from "@tanstack/react-query";

import { api } from "@/services";

export const fetchDeleteBusReservation = async (id: string) => {
  const res = await api.delete(`/v1/bus-reservation/${id}/`);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Ocorreu um erro ao deletar a reserva");
  }

  return res.data;
};

export const useDeleteBusReservation = () => {
  const { mutateAsync: deleteBusReservation, isPending } = useMutation({
    mutationFn: fetchDeleteBusReservation,
  });

  return { deleteBusReservation, isPending };
};
