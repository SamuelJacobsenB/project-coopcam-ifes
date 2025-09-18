import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { User, UserRequestDTO } from "../../types";

export const fetchCreateUser = async (user: UserRequestDTO) => {
  const res = await api.post<User>("/v1/user", user);

  if (res.status != 201) {
    throw new Error("Erro ao criar usuário");
  }

  return res.data;
};

export const useCreateUser = () => {
  const { mutateAsync: createUser } = useMutation({
    mutationFn: (user: UserRequestDTO) => fetchCreateUser(user),
  });

  return { createUser };
};
