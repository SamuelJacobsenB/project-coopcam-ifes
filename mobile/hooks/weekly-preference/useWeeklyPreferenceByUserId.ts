import { useQuery } from "@tanstack/react-query";

import { api } from "@/services";
import { WeeklyPreference } from "@/types";

export const fetchWeeklyPreferenceByUserId = async () => {
  try {
    const res = await api.get<WeeklyPreference>(
      `/v1/weekly-preference/`,
    );

    if (res.status !== 200)
      throw new Error("Ocorreu um erro ao buscar a preferência semanal");

    return res.data;
  } catch {
    throw new Error("Ocorreu um erro ao buscar a preferência semanal");
  }
};

export const useWeeklyPreferenceByUserId = () => {
  const {
    data: weeklyPreference,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["weekly-preference"],
    queryFn: fetchWeeklyPreferenceByUserId,
    retry: false,
  });

  return { weeklyPreference, isLoading, error };
};
