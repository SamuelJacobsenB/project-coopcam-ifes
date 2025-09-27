import { api } from "@/services";
import { useQuery } from "@tanstack/react-query";

const fetchVerifyUser = async () => {
  try {
    const res = await api.get("/v1/auth/verify/user/");

    if (res.status !== 200) throw new Error("Credenciais inválidas");

    return true;
  } catch {
    throw new Error("Credenciais inválidas");
  }
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
