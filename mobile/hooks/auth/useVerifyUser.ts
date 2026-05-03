import { useQuery } from "@tanstack/react-query";

import { api } from "@/services";

export const fetchVerifyUser = async (): Promise<true> => {
  const res = await api.get("/v1/auth/verify/user/");

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Credenciais inválidas");
  }

  return true;
};

export const useVerifyUser = () => {
  const {
    data: isVerified,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["verify-user"],
    queryFn: fetchVerifyUser,
    retry: false,
  });

  return { isVerified, isLoading, error };
};
