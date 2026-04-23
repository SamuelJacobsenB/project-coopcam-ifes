import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/";

const fetchVerifyDriver = async () => {
  const res = await api.get("/v1/auth/verify/driver/");

  if (res.status !== 200) throw new Error("Credenciais inválidas");

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
