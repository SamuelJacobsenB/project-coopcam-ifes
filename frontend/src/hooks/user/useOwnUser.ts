import { useQuery } from "@tanstack/react-query";
import { api } from "../../services";

export const fetchOwnUser = async () => {
  const res = await api.get("/v1/user/own/");

  if (res.status !== 200) throw new Error("Faça seu login");

  return res.data;
};

export const useOwnUser = () => {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: fetchOwnUser,
    retry: false,
  });

  return { user, isLoading, error, refetch };
};
