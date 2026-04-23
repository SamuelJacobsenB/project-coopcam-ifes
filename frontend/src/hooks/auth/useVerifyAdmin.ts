import { useQuery } from "@tanstack/react-query";

import { api } from "../../services";

export const fetchVerifyAdmin = async () => {
  const res = await api.get("/v1/auth/verify/admin/");

  if (res.status != 200) throw new Error("Usuário não autorizado");

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
  });

  return { isVerified, error, isLoading, refetch };
};
