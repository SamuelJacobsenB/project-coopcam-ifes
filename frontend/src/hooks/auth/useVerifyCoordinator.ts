import { useQuery } from "@tanstack/react-query";

import { api } from "../../services";

export const fetchVerifyCoordinator = async () => {
  const res = await api.get("/v1/auth/verify/coordinator");

  if (res.status != 200) throw new Error("Usuário não autorizado");

  return true;
};

export const useVerifyCoordinator = () => {
  const {
    data: isCoordinator,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["verifyCoordinator"],
    queryFn: fetchVerifyCoordinator,
  });

  return { isCoordinator, error, isLoading, refetch };
};
