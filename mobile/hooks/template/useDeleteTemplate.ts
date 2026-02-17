import { useMutation } from "@tanstack/react-query";

import { api } from "@/services";

export const fetchDeleteTemplate = async () => {
  try {
    const res = await api.delete(`/v1/template/`);

    if (res.status !== 204)
      throw new Error("Ocorreu um erro ao deletar o template");

    return res.data;
  } catch {
    throw new Error("Ocorreu um erro ao deletar o template");
  }
};

export const useDeleteTemplate = () => {
  const { mutateAsync: deleteTemplate, isPending } = useMutation({
    mutationFn: fetchDeleteTemplate,
  });

  return { deleteTemplate, isPending };
};
