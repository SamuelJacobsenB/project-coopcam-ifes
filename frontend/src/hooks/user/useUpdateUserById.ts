import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { User, UserUpdateDTO } from "../../types";

interface UpdateUserByIdProps {
  id: string;
  user: UserUpdateDTO;
}

export const fetchUpdateUserById = async ({
  id,
  user,
}: UpdateUserByIdProps) => {
  try {
    const res = await api.put<User>(`/v1/user/${id}/`, user);

    if (res.status !== 200) throw new Error("Erro ao atualizar usuário");

    return res.data;
  } catch {
    throw new Error("Erro ao atualizar usuário");
  }
};

export const useUpdateUserById = () => {
  const { mutateAsync: updateUserById } = useMutation({
    mutationFn: async ({ id, user }: UpdateUserByIdProps) =>
      fetchUpdateUserById({ id, user }),
  });

  return { updateUserById };
};
