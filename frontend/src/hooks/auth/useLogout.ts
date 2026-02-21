import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";

export const fetchLogout = async () => {
  try {
    const res = await api.get("/v1/auth/logout/");

    if (res.status !== 200) throw new Error("Erro ao deslogar");

    return "Deslogado com sucesso";
  } catch {
    throw new Error("Erro ao deslogar");
  }
};

export const useLogout = () => {
  const { mutateAsync: logout } = useMutation({
    mutationFn: fetchLogout,
    retry: false,
  });

  return { logout };
};
