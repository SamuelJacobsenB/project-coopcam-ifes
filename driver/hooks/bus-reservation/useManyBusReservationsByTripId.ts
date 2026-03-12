import { useMutation } from "@tanstack/react-query";

import { api } from "@/services";

export const fetchManyBusReservationsByTripId = async (tripId: string) => {
  const res = await api.get(`/v1/bus-reservation/trip/${tripId}/`);

  if (res.status !== 200) throw new Error("Erro ao buscar reservas");

  return res.data;
};

export const useManyBusReservationsByTripId = () => {
  const { mutateAsync: getManyBusReservationsByTripId } = useMutation({
    mutationFn: (tripId: string) => fetchManyBusReservationsByTripId(tripId),
  });

  return { getManyBusReservationsByTripId };
};
