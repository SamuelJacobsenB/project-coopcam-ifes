import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";
import type { LoginDTO } from "../../types";
import { fetchVerifyCoordinator, fetchLogout } from "./";

export const fetchLogin = async (loginDTO: LoginDTO) => {
  try {
    const res = await api.post("/v1/auth/login/", loginDTO);

    if (res.status === 200) {
      const verified = await fetchVerifyCoordinator();

      if (!verified) {
        await fetchLogout();
        throw new Error("Usuário não é coordenador");
      }

      return "Login realizado com sucesso";
    }

    throw new Error("Credenciais inválidas");
  } catch {
    throw new Error("Credenciais inválidas");
  }
};

export const useLogin = () => {
  const { mutateAsync: login } = useMutation({
    mutationFn: (loginDTO: LoginDTO) => fetchLogin(loginDTO),
    retry: false,
  });

  return { login };
};
