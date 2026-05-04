import { useQuery } from "@tanstack/react-query";

import { api } from "../../services";
import type { BusTripReport } from "../../types";

export const fetchManyBusTripReportsByDate = async (
  date: string,
): Promise<BusTripReport[]> => {
  const res = await api.get<BusTripReport[]>(
    `/v1/bus-trip-report/date/${date}/`,
  );

  if (res.code !== "SUCCESS") {
    throw new Error(res.message || "Erro ao buscar relatórios");
  }

  return res.data;
};

export const useManyBusTripReportsByDate = (date?: string) => {
  const {
    data: reports,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bustripreports", date],
    queryFn: () => fetchManyBusTripReportsByDate(date || ""),
    enabled: !!date,
    retry: false,
  });

  return { reports: reports ?? [], isLoading, error, refetch };
};
