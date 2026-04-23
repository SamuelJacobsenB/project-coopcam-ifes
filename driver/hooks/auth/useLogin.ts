import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@tanstack/react-query";

import { useUser } from "@/contexts";
import { api } from "@/services/";
import type { LoginDTO } from "@/types";

import { useVerifyDriver } from "./useVerifyDriver";

export const fetchLogin = async (loginDTO: LoginDTO) => {
  const res = await api.post("/v1/auth/login/", loginDTO);

  if (res.status !== 200) throw new Error("Credenciais inválidas");

  await AsyncStorage.setItem("auth_token", res.data.token);

  return res.data;
};

export const useLogin = () => {
  const { refetch: refetchDriverStatus } = useVerifyDriver();
  const { findUser } = useUser();

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: (loginDTO: LoginDTO) => fetchLogin(loginDTO),
    onSuccess: async () => {
      await findUser();
      await refetchDriverStatus();
    },
    retry: false,
  });

  return { login, isPending };
};
