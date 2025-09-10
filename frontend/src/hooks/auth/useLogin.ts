import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { LoginDTO } from "../../types";
import { fetchVerifyCoordinator, fetchLogout } from "./";

export const fetchLogin = async (loginDTO: LoginDTO) => {
  const res = await api.post("/v1/auth/login", loginDTO);

  if (res.status === 200) {
    const verified = await fetchVerifyCoordinator();

    if (!verified) {
      await fetchLogout();
    } else {
      return "Login realizado com sucesso";
    }
  } else {
    return null;
  }
};

export const useLogin = () => {
  const { mutateAsync: login } = useMutation({
    mutationFn: (loginDTO: LoginDTO) => fetchLogin(loginDTO),
    retry: false,
  });

  return { login };
};
