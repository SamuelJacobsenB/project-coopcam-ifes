import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/";

export const fetchVerifyDriver = async () => {
  const res = await api.get("/v1/auth/verify/driver/");

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Credenciais inválidas");
  }

  return true;
};

export const useVerifyDriver = () => {
  const {
    data: isVerified,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["verify-driver"],
    queryFn: fetchVerifyDriver,
    retry: false,
  });

  return { isVerified, isLoading, error, refetch };
};
