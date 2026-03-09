import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/";

const fetchVerifyUser = async () => {
  const res = await api.get("/v1/auth/verify/user/");

  if (res.status !== 200) throw new Error("Credenciais inválidas");

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
