import { useMutation } from "@tanstack/react-query";

import { useUser } from "../../contexts";
import { api } from "../../services";
import type { APIResponse, LoginDTO } from "../../types";
import { fetchLogout, fetchVerifyAdmin } from "./";

export const fetchLogin = async (loginDTO: LoginDTO): Promise<string> => {
  const res = await api.post<unknown, APIResponse<{ token: string }>>(
    "/v1/auth/login/",
    loginDTO,
  );

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Credenciais inválidas");
  }

  localStorage.setItem("auth_token", res.data.token);

  try {
    await fetchVerifyAdmin();
  } catch {
    await fetchLogout();
    throw new Error("Usuário não é administrador");
  }

  return "Login realizado com sucesso";
};

export const useLogin = () => {
  const { findUser } = useUser();

  const { mutateAsync: login } = useMutation({
    mutationFn: (loginDTO: LoginDTO) => fetchLogin(loginDTO),
    onSuccess: async () => {
      await findUser();
    },
    retry: false,
  });

  return { login };
};
