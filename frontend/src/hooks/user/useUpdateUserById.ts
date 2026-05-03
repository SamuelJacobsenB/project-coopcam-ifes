import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { User, UserUpdateDTO } from "../../types";

interface UpdateUserByIdParams {
  id: string;
  user: UserUpdateDTO;
}

export const fetchUpdateUserById = async ({
  id,
  user,
}: UpdateUserByIdParams): Promise<User> => {
  const res = await api.put<User>(`/v1/user/${id}/`, user);

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao atualizar usuário");
  }

  return res.data;
};

export const useUpdateUserById = () => {
  const { mutateAsync: updateUserById } = useMutation({
    mutationFn: (params: UpdateUserByIdParams) => fetchUpdateUserById(params),
    retry: false,
  });

  return { updateUserById };
};
