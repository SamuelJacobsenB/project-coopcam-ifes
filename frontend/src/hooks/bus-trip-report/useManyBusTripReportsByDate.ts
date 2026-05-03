import { useMutation } from "@tanstack/react-query";

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

export const useManyBusTripReportsByDate = () => {
  const { mutateAsync: getManyBusTripReportsByDate } = useMutation({
    mutationFn: (date: string) => fetchManyBusTripReportsByDate(date),
    retry: false,
  });

  return { getManyBusTripReportsByDate };
};
