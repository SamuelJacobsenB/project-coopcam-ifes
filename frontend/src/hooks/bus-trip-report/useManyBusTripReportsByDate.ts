import { useMutation } from "@tanstack/react-query";

import { api } from "../../services";

export const fetchManyBusTripReportsByDate = async (date: string) => {
  try {
    const res = await api.get(`/api/bus-trip-report/date/${date}/`);

    if (res.status !== 200) throw new Error("Erro ao buscar relatórios");

    return res.data;
  } catch {
    throw new Error("Erro ao buscar relatórios");
  }
};

export const useManyBusTripReportsByDate = () => {
  const { mutateAsync: getManyBusTripReportsByDate } = useMutation({
    mutationFn: (date: string) => fetchManyBusTripReportsByDate(date),
  });

  return { getManyBusTripReportsByDate };
};
