import { useMutation } from "@tanstack/react-query";
import { api } from "../../services";

export const fetchManyBusReservationsByDate = async (date: string) => {
  try {
    const res = await api.get(`/api/bus-reservation/date/${date}/`);

    if (res.status !== 200) throw new Error("Erro ao buscar reservas");

    return res.data;
  } catch {
    throw new Error("Erro ao buscar reservas");
  }
};

export const useManyBusReservationsByDate = () => {
  const { mutateAsync: getManyBusReservationsByDate } = useMutation({
    mutationFn: (date: string) => fetchManyBusReservationsByDate(date),
  });

  return { getManyBusReservationsByDate };
};
