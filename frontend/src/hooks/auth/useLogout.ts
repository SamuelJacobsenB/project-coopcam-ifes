import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";

export const fetchLogout = async () => {
  const res = await api.post("/v1/auth/logout/");

  if (res.status === 200) {
    return "Logout realizado com sucesso";
  } else {
    return null;
  }
};

export const useLogout = () => {
  const { mutateAsync: logout } = useMutation({
    mutationFn: fetchLogout,
    retry: false,
  });

  return { logout };
};
