import { useQuery } from "@tanstack/react-query";

import { api } from "@/services";
import { Template } from "@/types";

export const fetchTemplateByUserId = async () => {
  const res = await api.get<Template>(`/v1/template/`);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Ocorreu um erro ao buscar o template");
  }

  return res.data;
};

export const useTemplateByUserId = () => {
  const {
    data: template,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["template"],
    queryFn: fetchTemplateByUserId,
    retry: false,
  });

  return { template, isLoading, error, refetch };
};
