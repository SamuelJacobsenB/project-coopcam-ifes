import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { UnavailableDay, UnavailableDayRequestDTO } from "../../types";

export const fetchCreateUnavailableDay = async (
  unavailableDay: UnavailableDayRequestDTO,
): Promise<UnavailableDay> => {
  const res = await api.post<UnavailableDay>(
    "/v1/unavailable-day/",
    unavailableDay,
  );

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao criar dia indisponível");
  }

  return res.data;
};

export const useCreateUnavailableDay = () => {
  const { mutateAsync: createUnavailableDay } = useMutation({
    mutationFn: (unavailableDay: UnavailableDayRequestDTO) =>
      fetchCreateUnavailableDay(unavailableDay),
    retry: false,
  });

  return { createUnavailableDay };
};
