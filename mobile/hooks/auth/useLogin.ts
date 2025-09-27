import { useMutation } from "@tanstack/react-query";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "@/services";
import type { LoginDTO } from "@/types";

export const fetchLogin = async (loginDTO: LoginDTO) => {
  try {
    const res = await api.post("/v1/auth/login/", loginDTO);

    if (res.status !== 200) throw new Error("Credenciais inválidas");

    await AsyncStorage.setItem("auth_token", res.data.token);

    return res.data;
  } catch {
    throw new Error("Credenciais inválidas");
  }
};

export const useLogin = () => {
  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: (loginDTO: LoginDTO) => fetchLogin(loginDTO),
    retry: false,
  });

  return { login, isPending };
};
