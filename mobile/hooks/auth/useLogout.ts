import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "@/services";

export const fetchLogout = async (queryClient: QueryClient) => {
  try {
    const res = await api.get("/v1/auth/logout/");

    if (res.status !== 200) throw new Error("Erro ao realizar logout");

    await AsyncStorage.removeItem("auth_token");

    queryClient.clear();

    return "Deslogado com sucesso";
  } catch {
    throw new Error("Erro ao deslogar");
  }
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: logout } = useMutation({
    mutationFn: () => fetchLogout(queryClient),
    retry: false,
  });

  return { logout };
};
