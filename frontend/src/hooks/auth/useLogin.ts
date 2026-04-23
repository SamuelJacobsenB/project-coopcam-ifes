import { useMutation } from "@tanstack/react-query";
import { api } from "../../services";
import type { LoginDTO } from "../../types";
import { fetchLogout, fetchVerifyAdmin } from "./";

export const fetchLogin = async (loginDTO: LoginDTO) => {
  try {
    const res = await api.post("/v1/auth/login/", loginDTO);
    if (res.status !== 200) throw new Error("Credenciais inválidas");

    localStorage.setItem("auth_token", res.data.token);

    const verified = await fetchVerifyAdmin();
    if (!verified) {
      await fetchLogout();
      throw new Error("Usuário não é administrador");
    }

    return "Login realizado com sucesso";
  } catch {
    throw new Error("Erro ao realizar login");
  }
};

export const useLogin = () => {
  const { mutateAsync: login } = useMutation({
    mutationFn: (loginDTO: LoginDTO) => fetchLogin(loginDTO),
    retry: false,
  });

  return { login };
};
