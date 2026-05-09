import { useMutation } from "@tanstack/react-query";

import { api } from "@/services";
import { BusReservationRequestDTO } from "@/types";

export const fetchCreateBusReservation = async (
  dto: BusReservationRequestDTO,
) => {
  const res = await api.post("/v1/bus-reservation/", dto);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Ocorreu um erro ao criar a reserva");
  }

  return res.data;
};

export const useCreateBusReservation = () => {
  const { mutateAsync: createBusReservation, isPending } = useMutation({
    mutationFn: (dto: BusReservationRequestDTO) =>
      fetchCreateBusReservation(dto),
  });

  return { createBusReservation, isPending };
};
