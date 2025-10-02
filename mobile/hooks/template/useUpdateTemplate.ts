import { useMutation } from "@tanstack/react-query";

import { api } from "@/services";
import { TemplateUpdateDTO } from "@/types";

export const fetchUpdateTemplate = async (dto: TemplateUpdateDTO) => {
  try {
    const res = await api.put("/v1/template/", dto);

    if (res.status !== 200)
      throw new Error("Ocorreu um erro ao atualizar o template");

    return res.data;
  } catch {
    throw new Error("Ocorreu um erro ao atualizar o template");
  }
};

export const useUpdateTemplate = () => {
  const { mutateAsync: updateTemplate } = useMutation({
    mutationFn: (dto: TemplateUpdateDTO) => fetchUpdateTemplate(dto),
  });

  return { updateTemplate };
};
