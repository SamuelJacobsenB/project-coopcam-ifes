import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useUser } from "@/contexts";
import { api } from "@/services";

export const fetchLogout = async (): Promise<void> => {
  try {
    const res = await api.get("/v1/auth/logout/");

    if (res.code !== "SUCCESS") {
      throw new Error(res.message || "Erro ao deslogar");
    }
  } finally {
    await AsyncStorage.removeItem("auth_token");
  }
};

export const useLogout = () => {
  const { setUser } = useUser();
  const queryClient = useQueryClient();

  const { mutateAsync: logout } = useMutation({
    mutationFn: fetchLogout,
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
    },
    retry: false,
  });

  return { logout };
};
