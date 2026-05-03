import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type {
  AvailableOverride,
  AvailableOverrideRequestDTO,
} from "../../types";

export const fetchCreateAvailableOverride = async (
  availableOverride: AvailableOverrideRequestDTO,
): Promise<AvailableOverride> => {
  const res = await api.post<AvailableOverride>(
    "/v1/available-override/",
    availableOverride,
  );

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao criar dia disponível");
  }

  return res.data;
};

export const useCreateAvailableOverride = () => {
  const { mutateAsync: createAvailableOverride } = useMutation({
    mutationFn: (availableOverride: AvailableOverrideRequestDTO) =>
      fetchCreateAvailableOverride(availableOverride),
    retry: false,
  });

  return { createAvailableOverride };
};
