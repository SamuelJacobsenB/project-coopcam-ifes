import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/contexts";
import { api } from "@/services";
import { Template } from "@/types";

export const fetchTemplateByUserId = async (id: string) => {
  if (!id) throw new Error("Ocorreu um erro ao buscar o template");

  try {
    const res = await api.get<Template>(`/v1/template/user-id/${id}/`);

    if (res.status !== 200)
      throw new Error("Ocorreu um erro ao buscar o template");

    return res.data;
  } catch {
    throw new Error("Ocorreu um erro ao buscar o template");
  }
};

export const useTemplateByUserId = () => {
  const { user } = useUser();

  const {
    data: template,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["template"],
    queryFn: () => fetchTemplateByUserId(user?.id || ""),
    retry: false,
  });

  return { template, isLoading, error, refetch };
};
