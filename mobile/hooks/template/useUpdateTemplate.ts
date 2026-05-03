import { useMutation } from "@tanstack/react-query";

import { api } from "@/services";
import { TemplateUpdateDTO } from "@/types";

export const fetchUpdateTemplate = async (dto: TemplateUpdateDTO) => {
  const res = await api.put("/v1/template/", dto);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Ocorreu um erro ao atualizar o template");
  }

  return res.data;
};

export const useUpdateTemplate = () => {
  const { mutateAsync: updateTemplate } = useMutation({
    mutationFn: (dto: TemplateUpdateDTO) => fetchUpdateTemplate(dto),
  });

  return { updateTemplate };
};
