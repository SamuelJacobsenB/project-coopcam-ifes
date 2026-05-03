import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { User, UserRequestDTO } from "../../types";

export const fetchCreateUser = async (user: UserRequestDTO): Promise<User> => {
  const res = await api.post<User>("/v1/user/", user);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao criar usuário");
  }

  return res.data;
};

export const useCreateUser = () => {
  const { mutateAsync: createUser } = useMutation({
    mutationFn: (user: UserRequestDTO) => fetchCreateUser(user),
    retry: false,
  });

  return { createUser };
};
