import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";

interface PromoteUserProps {
  user_id: string;
  targetRole: "driver" | "admin";
}

export const fetchPromoteUser = async ({
  user_id,
  targetRole,
}: PromoteUserProps) => {
  const res = await api.post(`/v1/user/promote-to-${targetRole}/${user_id}/`);

  if (res.status != 200) throw new Error("Erro ao promover usuário");

  return res.data;
};

export const usePromoteUser = () => {
  const { mutateAsync: promoteUser } = useMutation({
    mutationFn: (props: PromoteUserProps) => fetchPromoteUser(props),
  });

  return { promoteUser };
};
