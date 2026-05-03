import { useMutation } from "@tanstack/react-query";

import { api } from "@/services";

export const fetchDeleteTemplate = async () => {
  const res = await api.delete(`/v1/template/`);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Ocorreu um erro ao deletar o template");
  }

  return res.data;
};

export const useDeleteTemplate = () => {
  const { mutateAsync: deleteTemplate, isPending } = useMutation({
    mutationFn: fetchDeleteTemplate,
  });

  return { deleteTemplate, isPending };
};
