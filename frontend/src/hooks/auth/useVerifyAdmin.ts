import { useQuery } from "@tanstack/react-query";

import { api } from "../../services";

export const fetchVerifyAdmin = async (): Promise<true> => {
  const res = await api.get("/v1/auth/verify/admin/");

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Usuário não autorizado");
  }

  return true;
};

export const useVerifyAdmin = () => {
  const {
    data: isVerified,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["verify-admin"],
    queryFn: fetchVerifyAdmin,
    retry: false,
  });

  return { isVerified, error, isLoading, refetch };
};
