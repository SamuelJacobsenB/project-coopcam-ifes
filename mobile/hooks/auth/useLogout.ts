import { useMutation } from "@tanstack/react-query";

import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchLogout = async () => {
  try {
    await AsyncStorage.removeItem("auth_token");

    return "Deslogado com sucesso";
  } catch {
    throw new Error("Erro ao deslogar");
  }
};

export const useLogout = () => {
  const { mutateAsync: logout } = useMutation({
    mutationFn: fetchLogout,
    retry: false,
  });

  return { logout };
};
