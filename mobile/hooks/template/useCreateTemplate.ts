import { useMutation } from "@tanstack/react-query";

import { api } from "@/services";
import { TemplateRequestDTO } from "@/types";

export const fetchCreateTemplate = async (dto: TemplateRequestDTO) => {
  const res = await api.post("/v1/template/", dto);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Ocorreu um erro ao criar o template");
  }

  return res.data;
};

export const useCreateTemplate = () => {
  const { mutateAsync: createTemplate, isPending } = useMutation({
    mutationFn: (dto: TemplateRequestDTO) => fetchCreateTemplate(dto),
  });

  return { createTemplate, isPending };
};
