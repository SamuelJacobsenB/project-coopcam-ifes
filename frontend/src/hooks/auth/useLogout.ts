import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUser } from "../../contexts";
import { api } from "../../services";

export const fetchLogout = async () => {
  try {
    const res = await api.get("/v1/auth/logout/");
    localStorage.removeItem("auth_token");

    if (res.status !== 200) throw new Error("Erro ao deslogar");

    return "Deslogado com sucesso";
  } catch {
    throw new Error("Erro ao deslogar");
  }
};

export const useLogout = () => {
  const { setUser } = useUser();
  const queryClient = useQueryClient();

  const { mutateAsync: logout } = useMutation({
    mutationFn: fetchLogout,
    onSuccess: () => {
      queryClient.invalidateQueries();
      setUser(null);
    },
    retry: false,
  });

  return { logout };
};
