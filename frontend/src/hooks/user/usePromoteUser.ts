import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { User } from "../../types";

interface PromoteUserParams {
  userId: string;
  targetRole: "driver" | "admin";
}

export const fetchPromoteUser = async ({
  userId,
  targetRole,
}: PromoteUserParams): Promise<User> => {
  const res = await api.post<User>(
    `/v1/user/promote-to-${targetRole}/${userId}/`,
  );

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao promover usuário");
  }

  return res.data;
};

export const usePromoteUser = () => {
  const { mutateAsync: promoteUser } = useMutation({
    mutationFn: (params: PromoteUserParams) => fetchPromoteUser(params),
    retry: false,
  });

  return { promoteUser };
};
