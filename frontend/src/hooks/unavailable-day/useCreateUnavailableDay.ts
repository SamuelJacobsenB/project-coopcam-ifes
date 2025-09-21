import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { UnavailableDay, UnavailableDayRequestDTO } from "../../types";

export const fetchCreateUnavailableDay = async (
  unavailableDay: UnavailableDayRequestDTO
) => {
  const res = await api.post<UnavailableDay>(
    "/v1/unavailable-day/",
    unavailableDay
  );

  if (res.status !== 201) throw new Error("Erro ao criar dia indisponível");

  return res.data;
};

export const useCreateUnavailableDay = () => {
  const { mutateAsync: createUnavailableDay } = useMutation({
    mutationFn: (unavailableDay: UnavailableDayRequestDTO) =>
      fetchCreateUnavailableDay(unavailableDay),
  });

  return { createUnavailableDay };
};
