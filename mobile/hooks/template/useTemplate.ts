import { useQuery } from "@tanstack/react-query";

import { api } from "@/services";
import { Template } from "@/types";

export const fetchTemplate = async () => {
  const res = await api.get<Template>(`/v1/template/`);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Ocorreu um erro ao buscar o template");
  }

  return res.data;
};

export const useTemplate = () => {
  const {
    data: template,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["template"],
    queryFn: fetchTemplate,
    retry: false,
  });

  return { template, isLoading, error, refetch };
};
