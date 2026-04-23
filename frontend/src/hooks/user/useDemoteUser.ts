import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";

export const fetchDemoteUser = async (user_id: string) => {
  const res = await api.post(`/v1/user/demote/${user_id}/`);

  if (res.status != 200) throw new Error("Erro ao rebaixar usuário");

  return res.data;
};

export const useDemoteUser = () => {
  const { mutateAsync: demoteUser } = useMutation({
    mutationFn: (user_id: string) => fetchDemoteUser(user_id),
  });

  return { demoteUser };
};
