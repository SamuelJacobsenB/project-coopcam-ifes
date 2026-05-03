import { useQuery } from "@tanstack/react-query";

import { api } from "@/services";
import { WeeklyPreference } from "@/types";

export const fetchWeeklyPreferenceByUserId = async () => {
  const res = await api.get<WeeklyPreference>(`/v1/weekly-preference/`);

  if (res.code !== "SUCCESS") {
    throw new Error(
      res.message || "Ocorreu um erro ao buscar a preferência semanal",
    );
  }

  return res.data;
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
