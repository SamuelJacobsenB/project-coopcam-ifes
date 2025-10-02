import { useMutation } from "@tanstack/react-query";

import { api } from "@/services";
import { TemplateRequestDTO } from "@/types";

export const fetchCreateTemplate = async (dto: TemplateRequestDTO) => {
  try {
    const res = await api.post("/v1/template/", dto);

    if (res.status !== 201)
      throw new Error("Ocorreu um erro ao criar o template");

    return res.data;
  } catch {
    throw new Error("Ocorreu um erro ao criar o template");
  }
};

export const useCreateTemplate = () => {
  const { mutateAsync: createTemplate, isPending } = useMutation({
    mutationFn: (dto: TemplateRequestDTO) => fetchCreateTemplate(dto),
  });

  return { createTemplate, isPending };
};
