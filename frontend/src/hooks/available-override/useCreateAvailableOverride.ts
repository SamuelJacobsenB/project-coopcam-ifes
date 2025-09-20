import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type {
  AvailableOverride,
  AvailableOverrideRequestDTO,
} from "../../types";

export const fetchCreateAvailableOverride = async (
  availableOverride: AvailableOverrideRequestDTO
) => {
  const res = await api.post<AvailableOverride>(
    "/v1/available-override",
    availableOverride
  );

  if (res.status !== 201) throw new Error("Erro ao criar dia disponível");

  return res.data;
};

export const useCreateAvailableOverride = () => {
  const { mutateAsync: createAvailableOverride } = useMutation({
    mutationFn: (availableOverride: AvailableOverrideRequestDTO) =>
      fetchCreateAvailableOverride(availableOverride),
  });

  return { createAvailableOverride };
};
