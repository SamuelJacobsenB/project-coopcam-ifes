import { useQuery } from "@tanstack/react-query";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from "@/services/";

const USER_STORAGE_KEY = "@auth_user";

export const fetchOwnUser = async () => {
  try {
    const res = await api.get("/v1/user/own/");
    if (res.status !== 200) throw new Error("Não autorizado");

    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data));

    return res.data;
  } catch {
    const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

    if (storedUser) {
      return JSON.parse(storedUser);
    }

    throw new Error("Faça seu login");
  }
};

export const useOwnUser = () => {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchOwnUser,
    staleTime: 1000 * 60 * 30, // Segura por 30 minutos
  });

  return { user, isLoading, isError, error, refetch };
};
