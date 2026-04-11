import { useMutation } from "@tanstack/react-query";

import { api } from "@/services";
import {
  getScannedUsersByTripId,
  setReservationsByTripId,
  setScannedUsersByTripId,
} from "@/utils";

export const fetchCreateManyBusTripReports = async (id: string) => {
  const scannedUsers = await getScannedUsersByTripId(id);
  if (scannedUsers.length === 0) return;

  const res = await api.post(`/v1/bus-trip-report/trip/${id}/`, {
    scannedUsers,
  });

  if (res.status !== 201) throw new Error("Erro ao criar relatórios de viagem");

  await setScannedUsersByTripId(id, []);
  await setReservationsByTripId(id, []);
};

export const useCreateManyBusTripReports = () => {
  const { mutateAsync: createManyBusTripReports } = useMutation({
    mutationFn: (id: string) => fetchCreateManyBusTripReports(id),
  });

  return { createManyBusTripReports };
};
