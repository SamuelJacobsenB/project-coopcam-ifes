import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";

import { useUser } from "@/contexts";
import { api } from "@/services/";
import type { APIResponse, LoginDTO } from "@/types";
import { fetchLogout, fetchVerifyDriver } from "./";

export const fetchLogin = async (loginDTO: LoginDTO) => {
  const res = await api.post<unknown, APIResponse<{ token: string }>>(
    "/v1/auth/login/",
    loginDTO,
  );

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Credenciais inválidas");
  }

  await AsyncStorage.setItem("auth_token", res.data.token);

  try {
    await fetchVerifyDriver();
  } catch {
    await fetchLogout();
    throw new Error("Usuário não é motorista");
  }

  return "Login realizado com sucesso";
};

export const useLogin = () => {
  const { findUser } = useUser();

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: (loginDTO: LoginDTO) => fetchLogin(loginDTO),
    onSuccess: async () => {
      await findUser();
    },
    retry: false,
  });

  return { login, isPending };
};
