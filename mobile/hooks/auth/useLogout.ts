import { useMutation, useQueryClient } from "@tanstack/react-query";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useUser } from "@/contexts";
import { api } from "@/services";

export const fetchLogout = async () => {
  try {
    const res = await api.get("/v1/auth/logout/");

    if (res.status !== 200) throw new Error("Erro ao realizar logout");

    await AsyncStorage.removeItem("auth_token");

    return "Deslogado com sucesso";
  } catch {
    throw new Error("Erro ao deslogar");
  }
};

export const useLogout = () => {
  const { setUser } = useUser();
  const queryClient = useQueryClient();

  const { mutateAsync: logout } = useMutation({
    mutationFn: () => fetchLogout(),
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
    },
    retry: false,
  });

  return { logout };
};
