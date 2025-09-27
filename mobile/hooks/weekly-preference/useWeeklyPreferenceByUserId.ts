import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/contexts";
import { api } from "@/services";
import { WeeklyPreference } from "@/types";

export const fetchWeeklyPreferenceByUserId = async (id: string) => {
  if (!id) throw new Error("Ocorreu um erro ao buscar a preferência semanal");

  try {
    const res = await api.get<WeeklyPreference>(
      `/v1/weekly-preference/user-id/${id}/`
    );

    if (res.status !== 200)
      throw new Error("Ocorreu um erro ao buscar a preferência semanal");

    return res.data;
  } catch {
    throw new Error("Ocorreu um erro ao buscar a preferência semanal");
  }
};

export const useWeeklyPreferenceByUserId = () => {
  const { user } = useUser();

  const {
    data: weeklyPreference,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["weekly-preference"],
    queryFn: () => fetchWeeklyPreferenceByUserId(user?.id || ""),
    retry: false,
  });

  return { weeklyPreference, isLoading, error };
};
