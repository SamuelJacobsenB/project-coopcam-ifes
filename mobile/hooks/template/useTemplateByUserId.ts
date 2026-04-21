import { useQuery } from "@tanstack/react-query";

import { api } from "@/services";
import { Template } from "@/types";

export const fetchTemplateByUserId = async () => {
  try {
    const res = await api.get<Template>(`/v1/template/`);

    if (res.status !== 200)
      throw new Error("Ocorreu um erro ao buscar o template");

    return res.data;
  } catch {
    throw new Error("Ocorreu um erro ao buscar o template");
  }
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
